from functools import wraps
from collections import OrderedDict

from flask import abort, request, g
from flask_login import current_user
from flask_httpauth import HTTPTokenAuth
from werkzeug.datastructures import Authorization


def permission_required(permission):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not current_user.can(permission):
                abort(403)
            return func(*args, **kwargs)
        return wrapper
    return decorator

def admin_required(func):
    return permission_required('ADMINISTER')(func)

def extend_attribute(obj, new_attr, attr):
    def _extend(item):
        setattr(item, new_attr, getattr(item, attr))
        return item

    if isinstance(obj, list):
        return list(map(_extend, obj))
    else:
        return _extend(obj)


class HTTPJWTAuth(HTTPTokenAuth):
    def login_with_token(self):
        auth = None
        if 'Authorization' in request.headers:
            try:
                auth_type, token = request.headers['Authorization'].split(
                    None, 1)
                auth = Authorization(auth_type, {'token': token})
            except ValueError:
                # The Authorization header is either empty or has no token
                pass

        if auth is not None and auth.type.lower() != self.scheme.lower():
            auth = None

        if request.method != 'OPTIONS':  # pragma: no cover
            password = None
            if not self.authenticate(auth, password):
                # Clear TCP receive buffer of any pending data
                request.data
                return self.auth_error_callback()

    def permission_required(self, permission):
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                self.login_with_token()
                if not g.user.can(permission):
                    abort(403)
                return func(*args, **kwargs)
            return wrapper
        return decorator

    def admin_required(self, func):
        return self.permission_required('ADMINISTER')(func)


class ArchiveDict(object):
    def __init__(self, archives):
        self.dict = OrderedDict(archives)
        self.keys = list(self.dict.keys())

    def prev(self, key):
        try:
            index = self.keys.index(key)
            return self.keys[index+1]
        except (ValueError, IndexError):
            pass

    def next(self, key):
        try:
            index = self.keys.index(key)
            if index:
                return self.keys[index-1]
        except ValueError:
            pass

    def __getitem__(self, key):
        return self.dict[key]
