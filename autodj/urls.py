from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('lk/', views.lk, name='lk'),
    path('tutorial/', views.tutorial, name='tutorial'),
    path('partners/', views.partners, name='partners'),
    path('register/', views.register, name='register'),
    path('logout/', views.site_logout, name='logout'),
    path('scenaries/<int:pk>', views.scenaries, name='scenaries'),
    path('addtrigger/', views.addtrigger, name='addtrigger'),
    path('loadtrigger/', views.loadtrigger, name='loadtrigger'),
    path('addscen/', views.addscen, name='addscen'),
    path('loadscentrig/', views.loadscentrig, name='loadscentrig'),
]
