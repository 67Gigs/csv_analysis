import azure.functions as func
import pandas as pd
import json
import datetime
from blob_trigger import analyze_data

app = func.FunctionApp()

@app.route(route="uploadcsv", methods=["POST"], auth_level=func.AuthLevel.ANONYMOUS)
def upload_csv(req: func.HttpRequest) -> func.HttpResponse:
    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse(
                "Aucun fichier n'a été envoyé",
                status_code=400
            )

        df = pd.read_csv(file.stream, encoding='latin-1')
        anomalies = analyze_data(df)

        results = {
            'filename': file.filename,
            'timestamp': datetime.datetime.now().isoformat(),
            'anomalies': anomalies
        }

        return func.HttpResponse(
            json.dumps(results, indent=2),
            mimetype="application/json"
        )

    except Exception as e:
        return func.HttpResponse(
            f"Une erreur s'est produite : {str(e)}",
            status_code=500
        )