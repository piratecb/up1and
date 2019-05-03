import os
import hashlib
import mistune

from flask import Flask, url_for, request

from config import config


def register_extensions(app):
    from .extensions import db, login_manager
    db.init_app(app)
    login_manager.init_app(app)

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    register_extensions(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    @app.template_filter('strftime')
    def format_datatime(value, format='%b %d, %Y'):
        return value.strftime(format)

    @app.url_defaults
    def hashed_static_url(endpoint, values):
        if 'static' == endpoint or endpoint.endswith('.static'):
            filename = values.get('filename')
            if filename:
                blueprint = request.blueprint
                if '.' in endpoint:  # blueprint
                    blueprint = endpoint.rsplit('.', 1)[0]

                static_folder = app.static_folder
                
                # use blueprint, but dont set `static_folder` option
                if blueprint and app.blueprints[blueprint].static_folder:
                    static_folder = app.blueprints[blueprint].static_folder

                fp = os.path.join(static_folder, filename)
                if os.path.exists(fp):
                    with open(fp, 'rb') as f:
                        values['v'] = hashlib.md5(f.read()).hexdigest()[0:8]

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
