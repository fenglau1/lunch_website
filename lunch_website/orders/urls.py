from django.urls import path
from . import views

urlpatterns = [
    path('place_order/', views.place_order, name='place_order'),
    path('history/', views.order_history, name='order_history'),
    path('overdue/', views.overdue_orders, name='overdue_orders'),
    path('cancel/<int:order_id>/', views.cancel_order, name='cancel_order'),
]