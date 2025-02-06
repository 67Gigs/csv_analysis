from flask import Flask
from flask_cors import CORS
from routes import csv_routes
from asgiref.wsgi import WsgiToAsgi

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(csv_routes, url_prefix='/api')
    return app

# Create WSGI app
wsgi_app = create_app()
# Convert to ASGI app
asgi_app = WsgiToAsgi(wsgi_app)

if __name__ == '__main__':
    wsgi_app.run(debug=True)