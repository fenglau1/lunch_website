from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Restaurant, MenuItem

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'logo')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'price')
    list_filter = ('restaurant',)