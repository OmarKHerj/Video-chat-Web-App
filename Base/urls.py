from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name="home"),
    path('room/', views.room, name="room"),
    path('token/', views.Token, name="Token"),
    path('createuser/', views.CreateUser, name="CreateUser"),
    path('getuser/', views.GetUsers, name="GetUsers"),
    path('deleteuser/', views.DeleteUser, name="DeleteUser"),
]