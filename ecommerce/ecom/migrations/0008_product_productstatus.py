# Generated by Django 3.2.18 on 2023-06-20 05:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecom', '0007_alter_cart_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='productStatus',
            field=models.CharField(default='Available now', max_length=50),
        ),
    ]
