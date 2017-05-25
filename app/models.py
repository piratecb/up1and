import hashlib
import datetime
from flask import current_app
from flask_login import UserMixin, AnonymousUserMixin
from werkzeug.security import generate_password_hash, check_password_hash
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
        'editor': Permission.COMMENT | Permission.POST | Permission.PAGE,
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
        return self.group is not None and (self.permissions & permission) == permission

    def is_admin(self):
        return self.can(Permission.ADMINISTER)

    def gravatar(self, size=100, default='identicon', rating='g'):
        url = 'https://www.gravatar.com/avatar'
        hash = '' if self.email is None else hashlib.md5(self.email.encode('utf-8')).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)


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
    description = db.Column(db.String(128))
    content = db.Column(db.String)
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
        return '<Post %r>' % (self.content)

    @staticmethod
    def generate_fake(count=100):
        from random import seed, randint
        import forgery_py
        seed()
        user_count = User.query.count()
        for i in range(count):
            user = User.query.offset(randint(0, user_count - 1)).first()
            record = Post(title=forgery_py.lorem_ipsum.title(words_quantity=4),
                        content=forgery_py.lorem_ipsum.paragraph(separator='\n\n', wrap_start='', wrap_end='', html=False, sentences_quantity=3), 
                        created=forgery_py.date.date(True), 
                        author_id=user.id)
            db.session.add(record)
        db.session.commit()


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_admin(self):
        return False

login_manager.anonymous_user = AnonymousUser


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))