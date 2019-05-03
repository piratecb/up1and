from flask import current_app, request, g, jsonify, url_for
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_httpauth import HTTPBasicAuth, MultiAuth

from . import api
from ..extensions import db
from ..models import Post, User, Meta, Setting, AnonymousUser
from ..utils import HTTPJWTAuth, extend_attribute

rest_api = Api(api)

basic_auth = HTTPBasicAuth()
token_auth = HTTPJWTAuth('Bearer')
auth = MultiAuth(basic_auth, token_auth)

@basic_auth.verify_password
def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        g.user = AnonymousUser()
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
    else:
        g.user = AnonymousUser()
    return False


user_fields = {
    'username': fields.String,
    'nickname': fields.String,
    'email': fields.String,
}

meta_fields = {
    'id': fields.Integer,
    'slug': fields.String,
    'name': fields.String,
    'description': fields.String,
}

setting_fields = {
    'id': fields.Integer,
    'key': fields.String,
    'value': fields.String,
    'type': fields.String,
}

pagination_fields = {
    'prev': fields.String,
    'next': fields.String
}

post_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'slug': fields.String,
    'headline': fields.String,
    'content': fields.String,
    'created': fields.DateTime,
    'updated': fields.DateTime,
    'status': fields.Boolean,
    'url': fields.Url('main.post', absolute=True),
    'author': fields.Nested(user_fields),
    'metas': fields.Nested(meta_fields),
    'views': fields.Integer
}

post_list_fields = {
    'items': fields.List(fields.Nested(post_fields)),
    'links': fields.Nested(pagination_fields)
}

page_fields = {
    'id': fields.Integer,
    'slug': fields.String,
    'title': fields.String,
    'content': fields.String,
    'created': fields.DateTime,
    'updated': fields.DateTime,
    'url': fields.Url('main.page', absolute=True),
    'author': fields.Nested(user_fields)
}

page_list_fields = {
    'items': fields.List(fields.Nested(page_fields)),
    'links': fields.Nested(pagination_fields)
}


class TokenAPI(Resource):
    method_decorators = [auth.login_required]

    def get(self):
        token = g.user.generate_token(3600)
        return jsonify({'token': token.decode('ascii'), 'duration': 3600, 'username': g.user.username})

class PostListAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('draft', default=False, type=bool)
        self.parser.add_argument('limit', default=10, type=int)
        self.parser.add_argument('page', default=1, type=int)
        super(PostListAPI, self).__init__()

    @marshal_with(post_list_fields)
    def get(self, username=None, slug=None):
        args = self.parser.parse_args()
        status = not args.draft

        if not status:
            token_auth.login_with_token()
            if not g.user.can('POST'):
                abort(403)

        queryset = Post.query.filter_by(type='post', status=not args.draft).order_by(Post.created.desc())
        endpoint = 'api.posts'

        if username:
            queryset = queryset.join(User).filter(User.username == username)
            endpoint = 'api.posts_by_author'

        if slug:
            queryset = queryset.join(Post.metas).filter(Meta.slug == slug)
            endpoint = 'api.posts_by_meta'

        pagination = queryset.paginate(args.page, per_page=args.limit, error_out=False)
        posts = extend_attribute(pagination.items, 'pid', 'id')

        params = request.args.copy()
        params['limit'] = self.parser.parse_args().limit
        links = {}
        if pagination.has_prev:
            params['page'] = pagination.prev_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            links['prev'] = url
        if pagination.has_next:
            params['page'] = pagination.next_num
            url = url_for(endpoint, username=username, slug=slug, _external=True, **params)
            links['next'] = url

        data = {'items': posts, 'links': links}
        return data


class PostAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str)
        self.parser.add_argument('slug', type=str)
        self.parser.add_argument('headline', type=str)
        self.parser.add_argument('content', type=str)
        self.parser.add_argument('metas', action='append')
        self.parser.add_argument('status', default=True, type=bool)
        super(PostAPI, self).__init__()

    @marshal_with(post_fields)
    def get(self, pid):
        post = Post.query.get(pid)
        post = extend_attribute(post, 'pid', 'id')

        if not post:
            abort(404, message="Post {} doesn't exist".format(pid))

        if not post.status:
            token_auth.login_with_token()
            if not g.user.can('POST'):
                abort(403)

        return post

    @marshal_with(post_fields)
    @token_auth.permission_required('POST')
    def post(self):
        args = self.parser.parse_args()

        post = Post(title=args.title, slug=args.slug, headline=args.headline, content=args.content, status=args.status, author_id=g.user.id)
        post.add_metas(args.metas)
        db.session.add(post)
        db.session.commit()
        post = extend_attribute(post, 'pid', 'id')
        return post

    @marshal_with(post_fields)
    @token_auth.permission_required('POST')
    def put(self, pid):
        args = self.parser.parse_args()
        post = Post.query.get(pid)
        post = extend_attribute(post, 'pid', 'id')

        if not post:
            abort(404, message="Post {} doesn't exist".format(pid))

        for k, v in args.items():
            if k == 'metas':
                post.add_metas(v)
            else:
                setattr(post, k, v)

        db.session.commit()
        return post, 201

    @token_auth.permission_required('POST')
    def delete(self, pid):
        post = Post.query.get(pid)
        if not post:
            abort(404, message="Post {} doesn't exist".format(pid))

        db.session.delete(post)
        db.session.commit()
        return {}, 204


class PageListAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('limit', default=10, type=int)
        self.parser.add_argument('page', default=1, type=int)
        super(PageListAPI, self).__init__()

    @marshal_with(page_list_fields)
    def get(self):
        args = self.parser.parse_args()

        queryset = Post.query.filter_by(type='page').order_by(Post.created.desc())
        endpoint = 'api.pages'

        pagination = queryset.paginate(args.page, per_page=args.limit, error_out=False)
        pages = extend_attribute(pagination.items, 'pid', 'id')

        params = request.args.copy()
        params['limit'] = self.parser.parse_args().limit
        links = {}
        if pagination.has_prev:
            params['page'] = pagination.prev_num
            url = url_for(endpoint, _external=True, **params)
            links['prev'] = url
        if pagination.has_next:
            params['page'] = pagination.next_num
            url = url_for(endpoint, _external=True, **params)
            links['next'] = url

        data = {'items': pages, 'links': links}
        return data


class PageAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('title', type=str)
        self.parser.add_argument('slug', type=str)
        self.parser.add_argument('content', type=str)
        super(PageAPI, self).__init__()

    @marshal_with(page_fields)
    def get(self, pid):
        page = Post.query.get(pid)
        page = extend_attribute(page, 'pid', 'id')

        if not page:
            abort(404, message="Page /{} doesn't exist".format(slug))

        return page

    @marshal_with(page_fields)
    @token_auth.permission_required('PAGE')
    def post(self):
        args = self.parser.parse_args()

        page = Post(title=args.title, slug=args.slug, content=args.content, type='page', author_id=g.user.id)
        db.session.add(page)
        db.session.commit()
        page = extend_attribute(page, 'pid', 'id')
        return page

    @marshal_with(page_fields)
    @token_auth.permission_required('PAGE')
    def put(self, pid):
        args = self.parser.parse_args()
        page = Post.query.get(pid)
        page = extend_attribute(page, 'pid', 'id')

        if not page:
            abort(404, message="Page /{} doesn't exist".format(slug))

        for k, v in args.items():
            if v:
                setattr(page, k, v)

        db.session.commit()
        return page, 201

    @token_auth.permission_required('PAGE')
    def delete(self, pid):
        page = Post.query.get(pid)
        if not page:
            abort(404, message="Page /{} doesn't exist".format(slug))

        db.session.delete(page)
        db.session.commit()
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

        if user != g.user or not g.user.is_admin():
            abort(403)

        for k, v in args.items():
            if v:
                setattr(user, k, v)

        db.session.commit()
        return post, 201

    @token_auth.admin_required
    def delete(self, username):
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
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('name', type=str)
        self.parser.add_argument('slug', type=str)
        self.parser.add_argument('description', type=str)
        super(MetaAPI, self).__init__()

    @marshal_with(meta_fields)
    def get(self, mid):
        meta = Meta.query.get(mid)
        if not meta:
            abort(404, message="Meta {} doesn't exist".format(mid))
        return meta

    @marshal_with(meta_fields)
    @token_auth.permission_required('POST')
    def post(self):
        args = self.parser.parse_args()

        meta = Meta(name=args.name, slug=args.slug, description=args.description, type='tag')
        db.session.add(meta)
        db.session.commit()
        meta = extend_attribute(meta, 'pid', 'id')
        return meta

    @marshal_with(meta_fields)
    @token_auth.permission_required('POST')
    def put(self, mid):
        args = self.parser.parse_args()
        meta = Meta.query.get(mid)
        meta = extend_attribute(meta, 'pid', 'id')

        if not meta:
            abort(404, message="Meta {} doesn't exist".format(mid))

        for k, v in args.items():
            if v:
                setattr(meta, k, v)

        db.session.commit()
        return meta, 201

    @token_auth.permission_required('POST')
    def delete(self, mid):
        meta = Meta.query.get(mid)
        if not meta:
            abort(404, message="Meta {} doesn't exist".format(mid))

        db.session.delete(meta)
        db.session.commit()
        return {}, 204


class SettingListAPI(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('type', action='append', default=['blog'])
        super(SettingListAPI, self).__init__()

    @marshal_with(setting_fields)
    def get(self):
        args = self.parser.parse_args()
        settings = Setting.query.filter(Setting.type.in_(args.type)).all()
        return settings

    @marshal_with(setting_fields)
    def put(self):
        payload = request.get_json(force=True)
        settings = Setting.query.all()

        for setting in settings:
            for k, v in payload.items():
                if setting.key == k and setting.value != v:
                    setting.value = v

        db.session.commit()
        return settings, 201


rest_api.add_resource(PostListAPI, '/posts', endpoint='posts')
rest_api.add_resource(PostListAPI, '/posts/author/<path:username>', endpoint='posts_by_author')
rest_api.add_resource(PostListAPI, '/posts/meta/<path:slug>', endpoint='posts_by_meta')
rest_api.add_resource(PostAPI, '/posts/<int:pid>', endpoint='post', methods=['GET', 'PUT', 'DELETE'])
rest_api.add_resource(PostAPI, '/posts', methods=['POST'])
rest_api.add_resource(PageListAPI, '/pages', endpoint='pages')
rest_api.add_resource(PageAPI, '/pages/<int:pid>', endpoint='page', methods=['GET', 'PUT', 'DELETE'])
rest_api.add_resource(PageAPI, '/pages', methods=['POST'])
rest_api.add_resource(UserAPI, '/users/<path:username>', endpoint='user')
rest_api.add_resource(MetaListAPI, '/metas', endpoint='metas')
rest_api.add_resource(MetaAPI, '/metas/<int:mid>', endpoint='meta', methods=['GET', 'PUT', 'DELETE'])
rest_api.add_resource(MetaAPI, '/metas', methods=['POST'])
rest_api.add_resource(SettingListAPI, '/settings', endpoint='settings', methods=['GET', 'PUT'])

rest_api.add_resource(TokenAPI, '/token/', endpoint='token')
