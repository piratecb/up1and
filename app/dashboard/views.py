from flask import render_template, redirect, request, url_for, flash, current_app, abort
from flask_login import login_required, current_user
from . import dashboard
from .forms import PostForm, PostPreviewForm, ProfileForm, UserForm, MetaForm
from .. import db
from ..models import Post, Meta, User
from ..utils import permission_required, admin_required


@dashboard.route('/')
@login_required
def index():
    if not current_user.can('POST'):
        return redirect(url_for('dashboard.profile'))

    posts = Post.query.filter_by(type='post').order_by(Post.created.desc())
    return render_template('dashboard/index.html', posts=posts)


@dashboard.route('/post-draft', methods=['GET', 'POST'])
@login_required
@permission_required('POST')
def post_draft():
    pid = request.args.get('pid', type=int)
    do = request.args.get('do')
    editor_id = '-'.join(['editor-post', str(pid)])
    form = PostForm()

    if pid:
        post = Post.query.get_or_404(pid)

        if do == 'delete':
            if not current_user.can('OPERATE') and current_user.id != post.author_id:
                abort(403)

            db.session.delete(post)
            flash('你已成功删除了文章 %s' % post.title)
            return redirect(url_for('dashboard.manage_posts'))

        if form.validate_on_submit():
            post.title = form.title.data
            post.headline = form.headline.data
            post.content = form.content.data
            db.session.add(post)
            return redirect(url_for('dashboard.post_preview', pid=post.id))

        form.title.data = post.title
        form.headline.data = post.headline
        form.content.data = post.content
    else:
        if form.validate_on_submit():
            post = Post(title=form.title.data, headline=form.headline.data, content=form.content.data, author_id=current_user.id)
            db.session.add(post)
            db.session.flush()
            return redirect(url_for('dashboard.post_preview', pid=post.id))

    return render_template('dashboard/post_draft.html', form=form, editor_id=editor_id)


@dashboard.route('/post-preview', methods=['GET', 'POST'])
@login_required
@permission_required('POST')
def post_preview():
    pid = request.args.get('pid', type=int)
    form = PostPreviewForm()
    post = Post.query.get_or_404(pid)
    metas = Meta.query.filter_by(type='tag')

    if form.validate_on_submit():
        post.slug = form.slug.data
        post.status = form.status.data

        form_metas = [Meta.query.filter_by(type='tag', slug=slug).first() for slug in form.tags.data.split()]
        for meta in set(form_metas)^set(post.metas):
            if meta in post.metas:
                post.metas.remove(meta)
            else:
                post.metas.append(meta)

        db.session.add(post)
        flash('文章已发布 %s' % post.title)
        return redirect(url_for('dashboard.post_preview', pid=post.id))
    form.slug.data = post.slug
    form.tags.data = ' '.join([meta.slug for meta in post.metas])
    form.status.data = post.status
    return render_template('dashboard/post_preview.html', form=form, post=post, metas=metas)


@dashboard.route('/manage-posts')
@login_required
@permission_required('POST')
def manage_posts():
    page = request.args.get('page', 1, type=int)
    uid = request.args.get('uid', type=int)
    slug = request.args.get('tag')

    if slug:
        tag = Meta.query.filter_by(type='tag', slug=slug).first_or_404()
        query = tag.posts.order_by(Post.created.desc())
    else:
        query = Post.query.filter_by(type='post').order_by(Post.created.desc())

    if uid:
        query = query.filter_by(author_id=uid)

    if not current_user.can('OPERATE'):
        query = query.filter_by(author_id=current_user.id)

    pagination = query.paginate(page, per_page=10, error_out=False)
    posts = pagination.items
    return render_template('dashboard/manage_posts.html', posts=posts, pagination=pagination)


@dashboard.route('/manage-metas')
@login_required
@permission_required('POST')
def manage_metas():
    metas = Meta.query.filter_by(type='tag')
    return render_template('dashboard/manage_metas.html', metas=metas)


@dashboard.route('/meta', methods=['GET', 'POST'])
@login_required
@permission_required('POST')
def meta():
    slug = request.args.get('slug')
    do = request.args.get('do')
    form = MetaForm()

    if slug:
        meta = Meta.query.filter_by(slug=slug).first_or_404()

        if do == 'delete':
            db.session.delete(meta)
            flash('你已成功删除了标签 %s' % meta.name)
            return redirect(url_for('dashboard.manage_metas'))

        if form.validate_on_submit():
            meta.slug = form.slug.data
            meta.name = form.name.data
            meta.type = form.type.data
            meta.description = form.description.data
            db.session.add(meta)
            return redirect(url_for('dashboard.manage_metas'))

        form.slug.data = meta.slug
        form.name.data = meta.name
        form.type.data = meta.type
        form.description.data = meta.description
    else:
        if form.validate_on_submit():
            meta = Meta(slug=form.slug.data, name=form.name.data, type=form.type.data, description=form.type.data)
            db.session.add(meta)
            return redirect(url_for('dashboard.manage_metas'))

    return render_template('dashboard/meta.html', form=form)


@dashboard.route('/write-page')
@login_required
@permission_required('PAGE')
def write_page():
    return render_template('dashboard/edit_page.html')


@dashboard.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    form = ProfileForm()

    if form.validate_on_submit():
        if form.password.data:
            current_user.password = form.password.data
            flash('密码修改成功')
        current_user.email = form.email.data
        current_user.nickname = form.nickname.data
        db.session.add(current_user)
        flash('用户资料更新成功')
        return redirect(url_for('dashboard.profile'))

    form.email.data = current_user.email
    form.nickname.data = current_user.nickname
    return render_template('dashboard/profile.html', form=form)


@dashboard.route('/manage-users')
@login_required
@admin_required
def manage_users():
    page = request.args.get('page', 1, type=int)
    pagination = User.query.paginate(page, per_page=10, error_out=False)
    users = pagination.items
    return render_template('dashboard/manage_users.html', users=users, pagination=pagination)

@dashboard.route('/user', methods=['GET', 'POST'])
@login_required
@admin_required
def user():
    uid = request.args.get('uid', type=int)
    do = request.args.get('do')
    form = UserForm()

    if uid:
        user = User.query.get_or_404(uid)

        if do == 'delete':
            db.session.delete(user)
            flash('你已删除了用户 %s' % user.username)
            return redirect(url_for('dashboard.manage_users'))

        if form.validate_on_submit():
            if form.password.data:
                user.password = form.password.data
                flash('密码修改成功')
            user.email = form.email.data
            user.nickname = form.nickname.data
            user.group = form.group.data
            db.session.add(user)
            flash('用户资料更新成功')
            return redirect(url_for('dashboard.manage_users'))

        form.username.data = user.username
        form.email.data = user.email
        form.nickname.data = user.nickname
        form.group.data = user.group
    else:
        if form.validate_on_submit():
            user = User(username=form.username.data, email=form.email.data, password=form.password.data, nickname=form.nickname.data, group=form.group.data)
            db.session.add(user)
            flash('添加新用户')
            return redirect(url_for('dashboard.manage_users'))

    return render_template('dashboard/user.html', form=form)

