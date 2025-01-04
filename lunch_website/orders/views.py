from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from .forms import OrderForm
from .models import Order
from django.contrib.auth.decorators import login_required

@login_required
def place_order(request):
    if request.method == 'POST':
        form = OrderForm(request.POST, request.FILES)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.save()
            return redirect('order_history')
    else:
        form = OrderForm()
    return render(request, 'orders/place_order.html', {'form': form})

from django.shortcuts import render
from .models import Order

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'orders/history.html', {'orders': orders})

from django.utils import timezone

@login_required
def overdue_orders(request):
    overdue = Order.objects.filter(user=request.user, is_paid=False, order_date__lt=timezone.now().date())
    return render(request, 'orders/overdue.html', {'overdue_orders': overdue})

@login_required
def cancel_order(request, order_id):
    order = Order.objects.get(id=order_id, user=request.user, is_paid=False)
    order.delete()
    return redirect('order_history')

from django.utils import timezone
from datetime import timedelta

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'orders/history.html', {'orders': orders})