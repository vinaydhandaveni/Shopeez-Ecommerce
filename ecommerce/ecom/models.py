from django.db import models
import json
from django.contrib.auth.models import User


class Product(models.Model):
    productImageUrl=models.CharField(max_length=10000)
    productName=models.CharField(max_length=50)
    productPrice=models.IntegerField()
    productId=models.IntegerField(primary_key=True)
    productTag=models.CharField(max_length=30)
    productDescription = models.CharField(max_length=10000)
    productRating = models.DecimalField(max_digits=3, decimal_places=2)
    productStatus=models.CharField(max_length=50,default='Available now')
    def save(self,*args,**kwargs):
        if isinstance(self.productDescription, dict):
            self.productDescription = json.dumps(self.productDescription)
        super().save(*args, **kwargs)
    def __str__(self):
        return str(self.productId)

class Cart(models.Model):
    custId=models.ForeignKey(User,on_delete=models.CASCADE)
    quantity=models.IntegerField(default=1)
    productId=models.ForeignKey(Product,on_delete=models.CASCADE,null=True)

class Order(models.Model):
    custId = models.ForeignKey(User,on_delete=models.CASCADE)
    orderDate = models.DateField(auto_now_add=True)
    productId = models.ForeignKey(Product,on_delete=models.CASCADE,null=True)
    quantity=models.IntegerField(default=1)