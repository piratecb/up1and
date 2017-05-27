from flask import render_template, redirect, request, url_for, flash, current_app, abort
from flask_login import login_required, current_user
from . import dashboard
from .forms import UserEditForm, PostForm, ProfileEditForm, ChangePasswordForm
from .. import db
from ..models import Post, Permission
from ..utils import permission_required, admin_required


@dashboard.route('/')
@login_required
def index():
    if current_user.group == 'user':
        return redirect(url_for('dashboard.profile'))

    posts = Post.query.filter_by(type='post').order_by(Post.created.desc())
    return render_template('dashboard/index.html', posts=posts)


@dashboard.route('/write-post', methods=['GET', 'POST'])
@login_required
def write_post():
    form = PostForm()
    if form.validate_on_submit():
        post = Post(title=form.title.data, content=form.content.data, author_id=current_user.id)
        db.session.add(post)
        db.session.flush()
        flash('文章已发布 %s' % post.title)
        return redirect(url_for('dashboard.manage_posts'))
    return render_template('dashboard/edit_post.html', form=form, editor_id='editor-post')

@dashboard.route('/edit-post/<int:post_id>', methods=['GET', 'POST'])
@login_required
def edit_post(post_id):
    post = Post.query.get_or_404(post_id)

    if current_user.id != post.author_id:
        abort(403)

    form = PostForm()

    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        db.session.add(post)
        flash('文章已更新 %s' % post.title)
        return redirect(url_for('dashboard.manage_posts'))
    form.title.data = post.title
    form.content.data = post.content
    return render_template('dashboard/edit_post.html', form=form, editor_id='editor-post' + str(post_id))

@dashboard.route('/delete-post/<int:post_id>')
@login_required
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)

    if current_user.id != post.author_id:
        abort(403)

    db.session.delete(post)
    flash('你已成功删除了文章 %s' % post.title)
    return redirect(url_for('dashboard.manage_posts'))

@dashboard.route('/manage-posts')
@login_required
def manage_posts():
    arg_page = request.args.get('page', 1, type=int)
    pagination = Post.query.filter_by(type='post').order_by(Post.created.desc()).paginate(arg_page, per_page=10, error_out=False)
    posts = pagination.items
    return render_template('dashboard/manage_posts.html', posts=posts, pagination=pagination)


@dashboard.route('/write-page')
@login_required
def write_page():
    return render_template('dashboard/edit_page.html')


@dashboard.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    profile_form = ProfileEditForm(prefix="profile_form")
    password_form = ChangePasswordForm(prefix="password_form")

    if profile_form.validate_on_submit() and profile_form.submit.data:
        print('profile')
        return redirect(url_for('dashboard.profile'))

    if password_form.validate_on_submit() and password_form.submit.data:
        print('password')
        return redirect(url_for('dashboard.profile'))

    return render_template('dashboard/profile.html', profile_form=profile_form, password_form=password_form)


@dashboard.route('/user', methods=['GET', 'POST'])
@login_required
@admin_required
def user():
    form = UserEditForm()
    if form.validate_on_submit():
        if form.password.data:
            current_user.password = form.password.data
            flash('密码修改成功')
        current_user.email = form.email.data
        current_user.nickname = form.nickname.data
        current_user.group = form.group.data
        db.session.add(current_user)
        flash('用户资料更新成功')
        return redirect(url_for('dashboard.user'))
    form.email.data = current_user.email
    form.nickname.data = current_user.nickname
    form.group.data = current_user.group
    return render_template('dashboard/user.html', form=form)

