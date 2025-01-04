from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'order_date', 'is_paid')
    list_filter = ('order_date', 'is_paid')