from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, TextAreaField, SelectMultipleField, SelectField
from wtforms.validators import Required, Length, EqualTo, Email, DataRequired
from wtforms import ValidationError
from ..models import Meta, User


class ProfileEditForm(FlaskForm):
    nickname = StringField('昵称', validators=[Length(1, 64)])
    email = StringField('电子邮箱', validators=[Length(1, 64), Email()])
    submit = SubmitField('更新我的档案')

    def validate_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('邮箱已被使用')


class ChangePasswordForm(FlaskForm):
    password = PasswordField('密码', validators=[Required(), EqualTo('password_confirm', message='密码必须相等')])
    password_confirm = PasswordField('确认密码', validators=[Required()])
    submit = SubmitField('更新密码')


class UserEditForm(ChangePasswordForm, ProfileEditForm):
    GROUPS = [(key, key.capitalize()) for key in User.PERMISSIONS]

    group = SelectField('用户组', choices=GROUPS)
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