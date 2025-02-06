from flask import Flask
from flask_cors import CORS
from backend.routes import csv_routes


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(csv_routes, url_prefix='/api')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)