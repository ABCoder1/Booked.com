from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.MainPage, name='MainPage'),
    path('register', views.Register, name='register')
]
