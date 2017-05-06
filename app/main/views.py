from flask import render_template, redirect, request, url_for, flash, current_app
from flask_login import login_required, login_user, logout_user, current_user
from . import main
from .forms import LoginForm, RegistrationForm
from .. import db
from ..models import User


@main.route('/')
def index():
    return render_template('index.html')