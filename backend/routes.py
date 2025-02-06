from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from azure.storage.blob import BlobServiceClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    email: str = Form(...)
):
    try:
        if not file.filename.lower().endswith('.csv'):
            raise HTTPException(status_code=400, detail="Seuls les fichiers CSV sont autorisés")

        connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = os.getenv('CONTAINER_NAME', 'csv-import')

        if not connect_str:
            raise HTTPException(status_code=500, detail="La configuration Azure Blob Storage est manquante")

        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        container_client = blob_service_client.get_container_client(container_name)

        if not container_client.exists():
            container_client.create_container()

        blob_name = file.filename
        blob_client = container_client.get_blob_client(blob_name)

        content = await file.read()
        blob_client.upload_blob(
            content,
            overwrite=True,
            metadata={'user_email': email}
        )

        return {
            'message': 'Fichier CSV uploadé avec succès',
            'filename': file.filename,
            'email': email,
            'container': container_name
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'upload : {str(e)}")

@router.get("/get-analysis")
async def get_analysis():
    try:
        connection_string = os.getenv('MONGODB_CONNECTION_STRING')
        client = MongoClient(connection_string)

        db = client['csvdata']
        collection = db['csvdata']

        analyses = list(collection.find().sort('timestamp', -1).limit(10))
        for analysis in analyses:
            analysis['_id'] = str(analysis['_id'])

        client.close()
        return analyses

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/latest-analysis")
async def get_latest():
    try:
        connection_string = os.getenv('MONGODB_CONNECTION_STRING')
        client = MongoClient(connection_string)

        db = client['csvdata']
        collection = db['csvdata']

        latest = collection.find_one(sort=[('timestamp', -1)])
        if latest:
            latest['_id'] = str(latest['_id'])

        client.close()
        return latest

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))