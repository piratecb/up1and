import os

basedir = os.path.abspath(os.path.dirname(__file__))
contentdir = os.path.join(basedir, 'content')
dbdir = os.path.join(contentdir, 'data')


class Config:
    SECRET_KEY = os.environ.get('DAYS_SECRET_KEY') or 'Waltz in A flat, Op.39 No.15'
    ANALYTICS_ID = os.environ.get('DAYS_ANALYTICS_ID') or 'YOUR GOOGLE ANALYTICS ID'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CONTENT_DIR = contentdir
    THEMES_DIR = os.path.join(contentdir, 'themes')

    @classmethod
    def init_app(cls, app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(dbdir, 'data-dev.sqlite')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(dbdir, 'data.sqlite')


config = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig,

    'default': DevelopmentConfig
}
