"""booked URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from booked.views import serve_favicon
from django.contrib import admin
from rest_framework import routers
from user.views import UserViewSet
from room.views import RoomViewSet
from django.urls import path,include
from booking.views import BookingViewSet
from time_slot.views import TimeSlotViewSet
from rest_framework_simplejwt import views as jwt_views

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, basename='user')
router.register(r'room', RoomViewSet, basename='room')
router.register(r'slot', TimeSlotViewSet, basename='slot')
router.register(r'booking', BookingViewSet, basename='booking')


urlpatterns = [
    path('', include('user.urls')),
    # path('', include('booking.urls')),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('favicon.ico', serve_favicon),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh')
]
