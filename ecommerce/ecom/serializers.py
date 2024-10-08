from ecom.models import Order,Product,Cart
from rest_framework import serializers

class orderSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields='__all__'

class cartSerializer(serializers.ModelSerializer):
    class Meta:
        model=Cart
        fields='__all__'

class productSerializer(serializers.ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'