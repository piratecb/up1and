from flask import render_template, redirect, request, url_for, flash, current_app
from flask_login import login_required, login_user, logout_user, current_user
from . import main
from .forms import LoginForm, RegistrationForm
from .. import db
from ..models import User, Post


@main.route('/')
def index():
    arg_page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(type='post').order_by(Post.created.desc()).paginate(arg_page, per_page=10, error_out=False)
    posts = pagination.items
    return render_template('index.html', posts=posts, pagination=pagination)

@main.route('/post/<int:post_id>')
def post(post_id):
    post = Post.query.get_or_404(post_id)
    return render_template('post.html', post=post)

@main.route('/<path:slug>')
def page(slug):
    page = Post.query.filter_by(type='page', slug=slug).first_or_404()
    return render_template('post.html', post=page)


@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            return redirect(request.args.get('next') or url_for('main.index'))
        flash('用户名或密码错误')
    return render_template('auth/login.html', form=form)


@main.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, password=form.password.data)
        db.session.add(user)
        flash('注册成功')
        return redirect(url_for('main.index'))
    return render_template('auth/register.html', form=form)


@main.route('/logout')
@login_required
def logout():
    logout_user()
    flash('你已退出登陆')
    return redirect(url_for('main.index'))


@main.route('/dashboard')
@login_required
def dashboard():
    posts = Post.query.filter_by(type='post').order_by(Post.created.desc())
    return render_template('dashboard/index.html', posts=posts)


@main.route('/dashboard/write-post')
@login_required
def write_post():
    return render_template('dashboard/write_post.html')


@main.route('/dashboard/write-page')
@login_required
def write_page():
    return render_template('dashboard/write_page.html')


@main.route('/dashboard/user')
@login_required
def user():
    return render_template('dashboard/user.html')

