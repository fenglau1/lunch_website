from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from menu.models import MenuItem

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    order_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    payment_proof = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.item.name}"