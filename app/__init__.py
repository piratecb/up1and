import hashlib
import mistune
from flask import Flask, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import config

db = SQLAlchemy()

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'main.login'


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    login_manager.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .dashboard import dashboard as dashboard_blueprint
    app.register_blueprint(dashboard_blueprint, url_prefix='/dash')

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    @app.context_processor
    def override_url_for():
        return dict(url_for=dated_url_for)

    def dated_url_for(endpoint, **values):
        import os
        if endpoint == 'static':
            filename = values.get('filename', None)
            if filename:
                file_path = os.path.join(app.root_path, endpoint, filename)
                values['v'] = int(os.stat(file_path).st_mtime)
        return url_for(endpoint, **values)

    @app.template_filter('strftime')
    def format_datatime(value, format='%b %d, %Y'):
        return value.strftime(format)

    @app.template_filter('markdown')
    def render_markdown(content):
        renderer = mistune.Renderer(hard_wrap=True)
        markdown = mistune.Markdown(renderer=renderer)
        return markdown(content)

    @app.template_filter('gravatar')
    def gravatar_url(email, size=100, default='identicon', rating='g'):
        url = 'https://www.gravatar.com/avatar'
        hash = '' if email is None else hashlib.md5(email.encode('utf-8').lower()).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(
            url=url, hash=hash, size=size, default=default, rating=rating)

    app.jinja_env.globals['ANALYTICS_ID'] = config[config_name].ANALYTICS_ID

    return app
