import json
from django.shortcuts import render
from .models import Order,Product,Cart
from django.views import View
from .serializers import orderSerializer,productSerializer,cartSerializer
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,get_user_model
# Create your views here.


#class based view to retrieve product details
class ProductView(View):
    def get(self, request):
        products = Product.objects.all()
        serializer = productSerializer(products, many=True)
        return JsonResponse(serializer.data,safe=False)
    

@api_view(['GET'])
def getItem(request,id):
    product=Product.objects.filter(productId=id)
    serializer = productSerializer(product, many=True)
    return JsonResponse(serializer.data,safe=False)

#funcional based view to add the cart to db
@api_view(['POST'])
def addCart(request):
       
        
        serializer = cartSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
           
            cart = serializer.save()
            return JsonResponse({'message': 'Cart item added successfully'})
        else:
            return JsonResponse(serializer.errors, status=400)
        



#function based view to get the cart details for a user
@api_view(['GET'])
def getCart(request,id):
    cartObj = Cart.objects.filter(custId=id)
    cartProducts=[]
    serializer = cartSerializer(cartObj, many=True)
    for cart in cartObj:
        product = cart.productId
        productDetails = {
             "id":cart.id,
             "productId":product.productId,
             "productTag":product.productTag,
            "productName": product.productName,
            "productDescription": product.productDescription,
            "productImageUrl": product.productImageUrl,
            "productPrice": product.productPrice,
            "Quantity":cart.quantity
        }
        cartProducts.append(productDetails)
    return JsonResponse(cartProducts,safe=False)


@api_view(['DELETE'])
def deleteCartObject(request,id):
    try:
        cartObj = Cart.objects.get(id=id)
        cartObj.delete()
        return JsonResponse({'message': 'Cart object deleted successfully'})
    except Cart.DoesNotExist:
        return JsonResponse({'message': 'Cart object not found'}, status=404)
    

#update quantity in cart Obj
@api_view(['PATCH'])
def updateCart(request, cart_id):
    try:
        cart = Cart.objects.get(id=cart_id)
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart item not found'}, status=404)

    serializer = cartSerializer(instance=cart, data=request.data, partial=True)
    if serializer.is_valid():
        cart = serializer.save()
        return JsonResponse({'message': 'Cart item updated successfully'})
    return JsonResponse(serializer.errors, status=400)
     


#to addOrder
@api_view(['POST'])
def addOrder(request):
    serializer = orderSerializer(data=request.data)
    print(request.data)
    if serializer.is_valid():  
        cart = serializer.save()
        return JsonResponse({'message': 'Order received'})
    else:
        return JsonResponse(serializer.errors, status=400)
    

#to get orders of a certain user 
@api_view(['GET'])
def getOrders(request,id):
     orders=Order.objects.filter(custId=id)
     Orders=[]
     for order in orders:
        product = order.productId
        productDetails = {
                "productId":product.productId,
                "productTag":product.productTag,
                "productName": product.productName,
                "productDescription": product.productDescription,
                "productImageUrl": product.productImageUrl,
                "productPrice": product.productPrice,
                "OrderDate":order.orderDate,
                "quantity":order.quantity
                
            }
        Orders.append(productDetails)
     return JsonResponse(Orders,safe=False)


#function based view to signup a user  
@api_view(['POST'])
def UserRegister(request):
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        print(request.data)
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username is already taken'}, status=400)
        user = User.objects.create_user(username=username, password=password, email=email)
        return JsonResponse({'message': 'User created successfully'})
        
@api_view(['GET'])
def getUsers(request):
     Users=User.objects.all()
     return JsonResponse(Users,safe=False)
     

#check for a user
@api_view(['POST'])
def login(request):
        email = request.data['email']
        password = request.data['password']
        print(email,password)
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        is_valid_password = user.check_password(password)

        if is_valid_password:
            user_details = {
                'username': user.username,
                'email': user.email,
                'id':user.id
            }
            return JsonResponse(user_details)
        else:
            return JsonResponse({'message': 'Password is invalid'}, status=401)
    

@api_view(['GET'])
def searchProducts(request,tag):
    if tag!='all':
        products=Product.objects.filter(productTag=tag)
    else:
        products=Product.objects.all()
    serializer = productSerializer(products, many=True)
    return JsonResponse(serializer.data,safe=False)


        

