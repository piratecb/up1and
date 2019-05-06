import os
import json
import datetime

from itertools import groupby

from flask import (render_template, redirect, request, g, url_for, flash, current_app, 
    abort, make_response, send_from_directory)
from flask_login import login_required, login_user, logout_user, current_user

from . import main
from .forms import LoginForm, SignupForm
from ..extensions import db
from ..models import User, Post, Meta
from ..utils import ArchiveDict

active_theme = 'kiko/'

@main.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc()).paginate(page, per_page=10, error_out=False)
    posts = pagination.items
    return render_template(active_theme + 'index.html', posts=posts, pagination=pagination)

@main.route('/post/<int:pid>')
def post(pid):
    post = Post.query.get_or_404(pid)
    post.views += 1
    db.session.add(post)
    return render_template(active_theme + 'post.html', post=post)

@main.route('/amp/post/<int:pid>')
def amp(pid):
    post = Post.query.get_or_404(pid)
    return render_template(active_theme + 'amp.html', post=post)

@main.route('/<path:slug>')
def page(slug):
    page = Post.query.filter_by(type='page', slug=slug).first_or_404()
    return render_template(active_theme + 'page.html', page=page)

@main.route('/archive/', defaults={'year': datetime.datetime.now().year})
@main.route('/archive/<int:year>')
def archive(year):
    query = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc())
    archives = ArchiveDict((year, list(posts)) for year, posts in groupby(query, lambda post: post.created.year))

    try:
        posts = archives[year]
    except KeyError:
        abort(404)
        
    pagination = {'prev': archives.prev(year), 'next': archives.next(year)}
    return render_template(active_theme + 'archive.html', posts=posts, pagination=pagination, year=year)

@main.route('/rss.xml')
def rss():
    posts = Post.query.filter_by(type='post', status=True).order_by(Post.created.desc()).limit(10)
    return render_template(active_theme + 'rss.xml', posts=posts)

@main.route('/tag/<path:slug>')
def tags(slug):
    tag = Meta.query.filter_by(type='tag', slug=slug).first_or_404()
    posts = tag.posts.order_by(Post.created.desc()).all()
    return render_template(active_theme + 'tags.html', posts=posts, tag=tag)

@main.route('/themes/<path:filename>')
def theme(filename):
    directory = os.path.join(current_app.config['THEMES_DIR'], active_theme, 'build')
    return send_from_directory(directory, filename)

@main.route('/assets/<path:filename>')
def asset(filename):
    directory = current_app.config['ASSETS_DIR']
    return send_from_directory(directory, filename)

@main.route('/account/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            response = make_response(redirect(request.args.get('next') or url_for('main.index')))
            response.set_cookie('jwt', user.generate_token())
            return response
        flash('用户名或密码错误')
    return render_template('account/login.html', form=form, title='Login')

@main.route('/account/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, password=form.password.data)
        db.session.add(user)
        flash('注册成功')
        return redirect(url_for('main.index'))
    return render_template('account/signup.html', form=form, title='Sign Up')

@main.route('/account/logout')
@login_required
def logout():
    logout_user()
    response = make_response(redirect(url_for('main.index')))
    response.set_cookie('jwt', expires=0)
    flash('你已退出登陆')
    return response

@main.route('/dashboard/')
@login_required
def dashboard():
    return render_template('dashboard/index.html')

# @main.route('/dashboard/<path:filename>')
# def redirect_dashboard_assets(filename):
#     return redirect(url_for('main.asset', filename=filename))
