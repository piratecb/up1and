from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, SelectMultipleField, SelectField
from wtforms.validators import Required, Length, EqualTo, Email, Regexp
from wtforms import ValidationError
from ..models import Meta, User


class ProfileForm(FlaskForm):
    nickname = StringField('昵称', validators=[Length(1, 64)])
    email = StringField('电子邮箱', validators=[Length(1, 64), Email()])
    password = PasswordField('密码', validators=[EqualTo('password_confirm', message='密码必须相等')])
    password_confirm = PasswordField('确认密码')
    submit = SubmitField()


class UserForm(ProfileForm):
    GROUPS = [(key, key.capitalize()) for key in User.PERMISSIONS]

    username = StringField('用户名', validators=[Length(1, 64), Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0, '用户名只能为字母、数字、下划线')])
    group = SelectField('用户组', choices=GROUPS)


class PostForm(FlaskForm):
    title = StringField('标题', validators=[Required(), Length(max=64)], render_kw={"placeholder": "Title"})
    headline = StringField('标题', validators=[Length(max=128)], render_kw={"placeholder": "Headline"})
    content = TextAreaField(validators=[Required()], render_kw={"placeholder": "Content Here..."})
    submit = SubmitField('预览')


class PostPreviewForm(FlaskForm):
    slug = StringField('Slug', validators=[Length(max=64)])
    tags = StringField('Tags', validators=[Length(max=32)])
    status = BooleanField('Publish')
    submit = SubmitField('发布')


class MetaForm(FlaskForm):
    TYPES = [('tag', 'Tag'), ('category', 'Category')]

    slug = StringField('Slug', validators=[Required(), Length(max=32)])
    name = StringField('Name', validators=[Required(), Length(max=32)])
    type = SelectField('类别', choices=TYPES)
    description = TextAreaField('描述', validators=[Length(max=64)])
    submit = SubmitField('增加')