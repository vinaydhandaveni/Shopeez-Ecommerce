from django.urls import path
from .views import ProductView,addCart,UserRegister,getCart,addOrder,getOrders,login,deleteCartObject,getUsers,updateCart,searchProducts,getItem

urlpatterns = [
    path('products', ProductView.as_view()),
    path('cart',addCart),
    path('signup',UserRegister),
    path('getcart/<int:id>',getCart),
    path('addOrder',addOrder),
    path('getorders/<int:id>',getOrders),
    path('logincheck',login),
    path('getusers',getUsers),
    path('deleteCart/<int:id>',deleteCartObject),
    path('updatecart/<int:id>',updateCart),
    path('search/<str:tag>',searchProducts),
    path('getItem/<int:id>',getItem)


    # Add other URL patterns for your project
]