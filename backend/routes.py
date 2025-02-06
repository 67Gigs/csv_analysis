from flask import Blueprint, request, jsonify
from azure.storage.blob import BlobServiceClient
import os
from dotenv import load_dotenv

load_dotenv()

csv_routes = Blueprint('csv_routes', __name__)

@csv_routes.route('/upload-csv', methods=['POST'])
def upload_csv():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier envoyé'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400

        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Seuls les fichiers CSV sont autorisés'}), 400

        connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
        container_name = os.getenv('CONTAINER_NAME', 'csv-import')
        email = request.form.get('email')

        if not connect_str:
            return jsonify({'error': 'La configuration Azure Blob Storage est manquante'}), 500

        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        container_client = blob_service_client.get_container_client(container_name)

        if not container_client.exists():
            container_client.create_container()

        blob_name = f"{file.filename}"
        blob_client = container_client.get_blob_client(blob_name)

        blob_client.upload_blob(
            file.read(),
            overwrite=True,
            metadata={'user_email': email}
        )

        return jsonify({
            'message': 'Fichier CSV uploadé avec succès',
            'filename': file.filename,
            'email': email,
            'container': container_name
        }), 200

    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de l\'upload : {str(e)}',
        }), 500