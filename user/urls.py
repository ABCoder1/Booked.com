from django.urls import path, include
from . import views

app_name = 'user'

urlpatterns = [
    path('', views.home, name='home'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('index', views.index, name='user')
]