import azure.functions as func
from azure.storage.blob import BlobServiceClient
import logging
import pandas as pd
import json
import datetime
import os

app = func.FunctionApp()
RESULT_CONTAINER = "csv-result"

def analyze_data(df):

    anomalies = []
    prix_anomalies = df[(df['Prix'] < 10) | (df['Prix'] > 500)]
    if not prix_anomalies.empty:
        anomalies.extend([
            f"Prix anormal: ID={row['ID']}, Prix={row['Prix']}"
            for _, row in prix_anomalies.iterrows()
        ])

    quantite_anomalies = df[(df['Quantité'] <= 0) | (df['Quantité'] > 1000)]
    if not quantite_anomalies.empty:
        anomalies.extend([
            f"Quantité anormale: ID={row['ID']}, Quantité={row['Quantité']}"
            for _, row in quantite_anomalies.iterrows()
        ])

    note_anomalies = df[(df['Note_Client'] < 1.0) | (df['Note_Client'] > 5.0)]
    if not note_anomalies.empty:
        anomalies.extend([
            f"Note anormale: ID={row['ID']}, Note={row['Note_Client']}"
            for _, row in note_anomalies.iterrows()
        ])

    return anomalies

def store_results(anomalies, filename, connection_string):
    results = {
        'filename': filename,
        'timestamp': datetime.datetime.now().isoformat(),
        'anomalies': anomalies
    }

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(RESULT_CONTAINER)

    try:
        container_client.create_container()
    except:
        pass

    output_blob_name = f"result_{filename}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    container_client.upload_blob(
        name=output_blob_name,
        data=json.dumps(results, indent=2),
        overwrite=True
    )

    return output_blob_name

@app.blob_trigger(arg_name="myblob",
                 path="csv-input/{name}",
                 connection="AzureWebJobsStorage")
def analyze_csv(myblob: func.InputStream):
    try:
        logging.info(f"Processing: {myblob.name}")
        df = pd.read_csv(myblob, encoding='latin-1')

        connection_string = os.environ["AzureWebJobsStorage"]
        anomalies = analyze_data(df)
        output_blob = store_results(
            anomalies,
            myblob.name.split('/')[-1],
            connection_string
        )

        logging.info(f"Results stored in: {output_blob}")

    except Exception as e:
        logging.error(f"Error: {str(e)}")