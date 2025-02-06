import os
import json
import smtplib
import logging
import azure.functions as func
import pandas as pd
from azure.storage.blob import BlobServiceClient
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import datetime
import requests
from pymongo import MongoClient

app = func.FunctionApp()

def store_to_mongodb(stats, filename):
    try:
        connection_string = os.getenv('MONGODB_CONNECTION_STRING')
        client = MongoClient(connection_string)
        db = client['csvdata']
        collection = db['csvdata']
        
        document = {
            'filename': filename,
            'timestamp': datetime.datetime.now(),
            'stats': stats
        }
        
        result = collection.insert_one(document)
        logging.info(f"MongoDB document inserted with id: {result.inserted_id}")
        client.close()
    except Exception as e:
        logging.error(f"Error storing to MongoDB: {str(e)}")

@app.blob_trigger(arg_name="myblob", 
                 path="csv-import/{name}", 
                 connection="AzureWebJobsStorage")
def blob_trigger(myblob: func.InputStream):
    logging.info(f"Python blob trigger function processed blob \n Name: {myblob.name}")
    
    df = pd.read_csv(myblob, encoding='latin-1')
    logging.info(f"Data preview:\n{df.head()}")
    
    anomalies = []
    total_price = df['Prix'].sum()
    total_quantity = df['Quantité'].sum()
    total_rating = df['Note_Client'].sum()
    count = len(df)
    
    for _, row in df.iterrows():
        if row['Prix'] < 0 or row['Prix'] > 500:
            anomalies.append({
                'ID': row['ID'],
                'Column': 'Prix',
                'Value': row['Prix']
            })
        if row['Quantité'] <= 0 or row['Quantité'] > 1000:
            anomalies.append({
                'ID': row['ID'],
                'Column': 'Quantité',
                'Value': row['Quantité']
            })
        if row['Note_Client'] < 1 or row['Note_Client'] > 5:
            anomalies.append({
                'ID': row['ID'],
                'Column': 'Note_Client',
                'Value': row['Note_Client']
            })
    
    stats = {
        'avgPrice': total_price / count,
        'avgQuantity': total_quantity / count,
        'avgRating': total_rating / count,
        'medianPrice': df['Prix'].median(),
        'medianQuantity': df['Quantité'].median(),
        'medianRating': df['Note_Client'].median(),
        'stdPrice': df['Prix'].std(),
        'stdQuantity': df['Quantité'].std(),
        'stdRating': df['Note_Client'].std(),
        'anomalies': anomalies
    }
    
    store_to_mongodb(stats, myblob.name)

    
    output_container = 'processed-results'
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv('AzureWebJobsStorage'))
    container_client = blob_service_client.get_container_client(output_container)
    
    if not container_client.exists():
        container_client.create_container()
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    blob_client = container_client.get_blob_client(f'analysis-result-{timestamp}.json')
    blob_client.upload_blob(json.dumps(stats, indent=2), overwrite=True)
    
    try:
        blob_client = blob_service_client.get_blob_client('csv-import', ''.join(myblob.name.split('/')[1:]))
        if blob_client.exists():
            blob_client.delete_blob()
            logging.info(f"Successfully deleted blob: {myblob.name}")
        else:
            logging.warning(f"Blob not found: {myblob.name}")
    except Exception as e:
        logging.error(f"Error deleting blob {myblob.name}: {str(e)}")
        # Continue execution even if deletion fails
    
    blob_client = blob_service_client.get_blob_client('csv-export', f'analysis-result-{timestamp}.csv')
    blob_client.upload_blob(df.to_csv(index=False), overwrite=True)
    
    # Get blob metadata to extract email
    blob_client = blob_service_client.get_blob_client('csv-import', ''.join(myblob.name.split('/')[1:]))
    blob_properties = blob_client.get_blob_properties()
    receiver_email = blob_properties.metadata.get('email', 'noureddine.bensadok1@gmail.com')
    send_notification(len(anomalies), receiver_email)
    logging.info('Analysis completed, results stored, and notification sent.')

def send_notification(anomaly_count, receiver_email):
    sender_email = os.getenv('EMAIL_USER')
    password = os.getenv('EMAIL_PASS')
    
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = 'CSV Analysis Completed'
    msg.attach(MIMEText(f'Analysis completed. Found {anomaly_count} anomalies.', 'plain'))
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
    
    requests.post('https://ntfy.sh/azurefunctionserverlessrapido', 
                 data='CSV Analysis Completed 😀'.encode(encoding='utf-8'))