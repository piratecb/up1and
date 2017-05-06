from flask import current_app
from flask_restful import Resource, Api, reqparse
from . import api
from .. import db
from ..models import Post, User

rest_api = Api(api)

class MainHandler(Resource):

    def get(self):
        return {
                'name': 'up1and',
            }



rest_api.add_resource(MainHandler, '/')