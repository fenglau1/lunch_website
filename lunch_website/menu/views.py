from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from .models import Restaurant

def restaurant_list(request):
    restaurants = Restaurant.objects.all()
    return render(request, 'menu/restaurant_list.html', {'restaurants': restaurants})

import csv
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import MenuItem, Restaurant

def upload_menu(request):
    if request.method == 'POST' and request.FILES['menu_file']:
        menu_file = request.FILES['menu_file']
        decoded_file = menu_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            restaurant, _ = Restaurant.objects.get_or_create(name=row['restaurant'])
            MenuItem.objects.create(
                restaurant=restaurant,
                name=row['name'],
                price=row['price'],
                description=row['description']
            )
        messages.success(request, 'Menu uploaded successfully!')
        return redirect('upload_menu')
    return render(request, 'menu/upload_menu.html')

def menu_list(request):
    menu_items = MenuItem.objects.all()
    return render(request, 'menu/menu_list.html', {'menu_items': menu_items})

