from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

from django.template.loader import get_template

def home(request):
    try:
        template = get_template('home.html')
        print("Template found at:", template.origin.name)
    except Exception as e:
        print("Template not found. Error:", e)
    return render(request, 'home.html')