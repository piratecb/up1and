import datetime
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, login_manager


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    nickname = db.Column(db.String(64))
    email = db.Column(db.String(64))
    password_hash = db.Column(db.String)
    token = db.Column(db.String)
    role = db.Column(db.Boolean)

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

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id


class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    slug = db.Column(db.String(32))

    def __repr__(self):
        return '<Tag %r>' % (self.name)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32))
    slug = db.Column(db.String(32))

    # todo parent

    def __repr__(self):
        return '<Category %r>' % (self.name)  

tag_relations = db.Table('tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id')),
    extend_existing=True
)

category_relations =  db.Table('categories',
    db.Column('category_id', db.Integer, db.ForeignKey('category.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('post.id')),
    extend_existing=True
)

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    slug = db.Column(db.String(64))
    content = db.Column(db.String)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    modify_timestamp = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    is_draft = db.Column(db.Boolean)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    author = db.relationship('User', backref='posts', lazy='dynamic')
    category = db.relationship('Category',
                            secondary=category_relations,
                            backref=db.backref('posts', lazy='dynamic'),
                            lazy='dynamic')
    tag = db.relationship('Tag',
                        secondary=tag_relations,
                        backref=db.backref('posts', lazy='dynamic'),
                        lazy='dynamic')

    def __repr__(self):
        return '<Post %r>' % (self.content)

    @staticmethod
    def generate_fake(count=100):
        from random import seed, randint
        import forgery_py
        seed()
        user_count = User.query.count()
        for i in range(count):
            u = User.query.offset(randint(0, user_count - 1)).first()
            record = Message(content=forgery_py.lorem_ipsum.sentences(randint(1, 3)), time=forgery_py.date.date(True), user=u)
        db.session.add(record)
        db.session.commit()




@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))