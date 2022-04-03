from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS

import requests
import uuid

from routes import client_api
from routes import *


app = Flask(__name__)
cors = CORS(app)
app.register_blueprint(routes)

socketio = SocketIO(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/cmdout', methods=['POST']) 
def cmdoutput():
    output = list(request.form.keys())[0]
    r = requests.post('http://citrusc2.tech/out', data={'output': output})
    return output


# @app.route('/bot/out', methods=['POST'])
# def out():
#     f = request.files['output'].read()

#     socketio.emit('out', f, broadcast=True)

#     return ('', 200)

# @socketio.on('message')
# def handle_message(data):
#     print('received message: ' + data)


# if __name__ == '__main__':
#     socketio.run(app, debug=True)