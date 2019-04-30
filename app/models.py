import json
import datetime

from flask import current_app
from flask_login import UserMixin, AnonymousUserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

from . import db, login_manager


class Permission:
    COMMENT = 0x01
    POST = 0x02
    PAGE = 0x04
    OPERATE = 0x08
    ADMINISTER = 0xff


class User(db.Model, UserMixin):
    PERMISSIONS = {
        'user': Permission.COMMENT,
        'author': Permission.COMMENT | Permission.POST,
        'editor': Permission.COMMENT | Permission.POST | Permission.PAGE | Permission.OPERATE,
        'administrator': Permission.ADMINISTER
    }

    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    nickname = db.Column(db.String(64))
    email = db.Column(db.String(64))
    password_hash = db.Column(db.String)
    token = db.Column(db.String)
    group = db.Column(db.String(16), default='user')
    bio = db.Column(db.Text)
    last_seen = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User %r>' % self.username

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def permissions(self):
        try:
            return self.PERMISSIONS[self.group]
        except Exception as e:
            return 0x00

    def can(self, permission):
        permission = getattr(Permission, permission)
        return self.group is not None and (self.permissions & permission) == permission

    def is_admin(self):
        return self.can('ADMINISTER')

    def generate_token(self, expiration=3600 * 24):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id, 'username': self.username})

    @staticmethod
    def verify_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


class Meta(db.Model):
    __tablename__ = 'metas'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), unique=True)
    slug = db.Column(db.String(32))
    type = db.Column(db.String(10), default='category')
    description = db.Column(db.String(64))
    order = db.Column(db.Integer, default=0)
    parent = db.Column(db.Integer, default=0)

    def __repr__(self):
        return '<%r %r>' % (self.type, self.name)


post_metas = db.Table('post_metas',
                    db.Column('meta_id', db.Integer, db.ForeignKey('metas.id')),
                    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')))


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    slug = db.Column(db.String(64))
    headline = db.Column(db.String(128))
    content = db.Column(db.Text)
    created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    type = db.Column(db.String(10), default='post')
    status = db.Column(db.Boolean)
    order = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=1)
    comment_status = db.Column(db.Boolean)

    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    metas = db.relationship('Meta',
                        secondary=post_metas,
                        backref=db.backref('posts', lazy='dynamic'))

    def __repr__(self):
        return '<Post %r %r>' % (self.title, self.created)

    def add_metas(self, metas):
        if metas is None:
            metas = []
        metas = [Meta.query.get(m) for m in metas]
        self.metas[:] = metas


class Setting(db.Model):
    __tablename__ = 'settings'
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(64))
    value = db.Column(db.Text)
    type = db.Column(db.String(64), default='blog')

    def __repr__(self):
        return '<Setting %r %r>' % (self.type, self.key)


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_admin(self):
        return False

login_manager.anonymous_user = AnonymousUser


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))