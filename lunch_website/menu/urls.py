from django.urls import path
from . import views

urlpatterns = [
    # Add URL patterns for the menu app here
    # Example:
    # path('restaurants/', views.restaurant_list, name='restaurant_list'),
 path('restaurants/', views.restaurant_list, name='restaurant_list'),
 path('upload/', views.upload_menu, name='upload_menu'),
 path('', views.menu_list, name='menu_list'),
]