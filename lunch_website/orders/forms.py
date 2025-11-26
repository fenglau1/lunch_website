from django import forms
from .models import Order
from menu.models import MenuItem

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['item', 'order_date', 'payment_proof']
        widgets = {
            'order_date': forms.DateInput(attrs={'type': 'date'}),
        }