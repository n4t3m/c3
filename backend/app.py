from flask import Flask, request, Blueprint
import uuid
from routes import client_api
from routes import *


app = Flask(__name__)
app.register_blueprint(routes)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"