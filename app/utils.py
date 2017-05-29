from functools import wraps
from collections import OrderedDict
from flask import abort
from flask_login import current_user


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
