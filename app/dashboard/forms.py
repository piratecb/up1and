from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, SelectMultipleField
from wtforms.validators import Required, Length, EqualTo, Email, DataRequired
from wtforms import ValidationError
from ..models import Meta


class UserEditForm(FlaskForm):
    password = PasswordField('密码', validators=[EqualTo('password_confirm', message='密码必须相等')])
    password_confirm = PasswordField('确认密码')
    nickname = StringField('昵称', validators=[Length(1, 64)])
    email = StringField('电子邮箱', validators=[Length(1, 64), Email()])
    role = BooleanField('管理员')
    submit = SubmitField('更新')


class PostForm(FlaskForm):
    title = StringField('标题', [DataRequired(), Length(max=255)])
    content = TextAreaField([DataRequired()])
    categories = SelectMultipleField('分类', coerce=int)
    submit = SubmitField('发布文章')
    save_draft = SubmitField('保存草稿')

    def __init__(self):
        super(PostForm, self).__init__()
        self.categories.choices = [(category.id, category.name) for category in Meta.query.filter_by(type='category')]