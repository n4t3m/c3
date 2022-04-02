from flask import Blueprint
routes = Blueprint('routes', __name__)

from .client_api import *