from flask import current_app, request, g, jsonify, url_for
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth, MultiAuth

from . import api
from .. import db
from ..models import Post, User, Meta

rest_api = Api(api)

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth('Bearer')
auth = MultiAuth(basic_auth, token_auth)

@basic_auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True

@token_auth.verify_token
def verify_token(token):
    try:
        user = User.verify_token(token)
    except:
        return False
    if user:
        g.user = user
        return True
    return False


def permission_required(permission):
    if not g.user.can(permission):
        abort(403)

def admin_required():
    return permission_required('ADMINISTER')


user_fields = {
    'username': fields.String,
    'nickname': fields.String,
    'email': fields.String,
}

meta_fields = {
    'slug': fields.String,
    'name': fields.String,
    'type': fields.String,
    'description': fields.String,
}

post_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'headline': fields.String,
    'content': fields.String,
    'created': fields.DateTime,
    'updated': fields.DateTime,
    'url': fields.Url('main.post', absolute=True),
    'author': fields.Nested(user_fields),
    'metas': fields.Nested(meta_fields),
}


class TokenAPI(Resource):
    method_decorators = [auth.login_required]

    def get(self):
        token = g.user.generate_token(6000)
        return jsonify({'token': token.decode('ascii'), 'duration': 6000, 'username': g.user.username})


class PostListAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('type', default='post', type=str)
        self.parser.add_argument('status', default=True, type=bool)
        self.parser.add_argument('limit', default=10, type=int)
        self.parser.add_argument('page', default=1, type=int)
        self.parser.add_argument('type', default='post', type=str)
        super(PostListAPI, self).__init__()

    @marshal_with(post_fields)
    def get(self, username=None, slug=None):
        args = self.parser.parse_args()
        queryset = Post.query.filter_by(type=args.type, status=args.status).order_by(Post.created.desc())
        endpoint = 'api.posts'
        params = request.args.copy()
        params['limit'] = args.limit
        link = ''

        if username:
            queryset = queryset.join(User).filter(User.username == username)
            endpoint = 'api.posts_by_author'

        if slug:
            queryset = queryset.join(Post.metas).filter(Meta.slug == slug)
            endpoint = 'api.posts_by_meta'

        pagination = queryset.paginate(args.page, per_page=args.limit, error_out=False)
        posts = pagination.items
        
        link_template = '<{url}>;rel="{rel}",'
        if pagination.has_prev:
            params['page'] = pagination.prev_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            link += link_template.format(url=url, rel='prev')
        if pagination.has_next:
            params['page'] = pagination.next_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            link += link_template.format(url=url, rel='next')

        return posts, {'Link': link}


class PostAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str)
        self.parser.add_argument('slug', type=str)
        self.parser.add_argument('headline', type=str)
        self.parser.add_argument('content', type=str)
        self.parser.add_argument('status', type=bool)
        super(PostAPI, self).__init__()

    @marshal_with(post_fields)
    def get(self, id):
        post = Post.query.get(id)
        if not post:
            abort(404, message="Post {} doesn't exist".format(id))
        return post

    @marshal_with(post_fields)
    @token_auth.login_required
    def put(self, id):
        permission_required('POST')

        args = self.parser.parse_args()
        post = Post.query.get(id)

        if not post:
            abort(404, message="Post {} doesn't exist".format(id))

        for k, v in args.items():
            if v:
                setattr(post, k, v)

        db.session.commit()
        return post, 201

    @token_auth.login_required
    def delete(self, id):
        permission_required('POST')

        post = Post.query.get(id)
        if not post:
            abort(404, message="Post {} doesn't exist".format(pid))

        session.delete(post)
        session.commit()
        return {}, 204


class UserAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('password', type=str)
        self.parser.add_argument('nickname', type=str)
        self.parser.add_argument('email', type=str)
        super(UserAPI, self).__init__()

    @marshal_with(user_fields)
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(username))
        return user

    @token_auth.login_required
    def put(self, username):
        args = self.parser.parse_args()
        user = User.query.filter_by(username=username).first()

        if not user:
            abort(404, message="User {} doesn't exist".format(id))

        if user != request.user or not request.user.is_admin():
            abort(403)

        for k, v in args.items():
            if v:
                setattr(user, k, v)

        db.session.commit()
        return post, 201

    @token_auth.login_required
    def delete(self, username):
        admin_required()

        user = User.query.filter_by(username=username).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(username))

        session.delete(user)
        session.commit()
        return {}, 204



class MetaListAPI(Resource):
    @marshal_with(meta_fields)
    def get(self):
        metas = Meta.query.all()
        return metas


class MetaAPI(Resource):
    @marshal_with(meta_fields)
    def get(self, slug):
        meta = Meta.query.filter(Meta.slug == slug).first()
        return meta



rest_api.add_resource(PostListAPI, '/posts', endpoint='posts')
rest_api.add_resource(PostListAPI, '/posts/author/<path:username>', endpoint='posts_by_author')
rest_api.add_resource(PostListAPI, '/posts/meta/<path:slug>', endpoint='posts_by_meta')
rest_api.add_resource(PostAPI, '/posts/<int:id>', endpoint='post')
rest_api.add_resource(UserAPI, '/users/<path:username>', endpoint='user')
rest_api.add_resource(MetaListAPI, '/metas', endpoint='metas')
rest_api.add_resource(MetaAPI, '/metas/<path:slug>', endpoint='meta')

rest_api.add_resource(TokenAPI, '/token/', endpoint='token')
