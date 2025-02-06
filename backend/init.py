import azure.functions as func
from function_app import app as route_app
from blob_trigger import app as blob_app

app = func.FunctionApp()

for route in route_app.get_functions():
    app.register_functions(route)

for blob_function in blob_app.get_functions():
    app.register_functions(blob_function)