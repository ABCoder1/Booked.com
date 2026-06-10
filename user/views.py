import jwt
import logging
from uuid import uuid4
from urllib.parse import parse_qs
from .models import User, user_types
from room.models import Room
from booking.models import Booking
from room.serializers import RoomReadSerializer
from booking.serializers import BookingReadSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserCreateSerializer, UserReadSerializer, UserUpdateSerializer

logger_name = "root"

# Create your views here.

# User ViewSet for basic CRUD Handling
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserReadSerializer
        elif self.action == 'update':
            return UserUpdateSerializer
        return UserCreateSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'POST':
            return []
        return [JWTAuthentication()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_serializer = UserReadSerializer(user)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_serializer = UserReadSerializer(instance)
        return Response(response_serializer.data)

    @action(detail=True, methods=['get'], url_path='room')
    def getRoomsForUser(self, request, pk=None):
        logger = logging.getLogger(logger_name)

        try:
            # # TODO: Add encryption to token
            # token = request.headers['Authorization'].split(" ")[1]
            # tokenData = jwt.decode(token, options={"verify_signature": False})
            # logger.info(f"userID : {tokenData['user_id']}")
            user = self.get_object()
            rooms = Room.objects.filter(manager=user)
            roomsDTO = RoomReadSerializer(rooms, many=True)
            return Response(roomsDTO.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


    @action(detail=True, methods=['get'], url_path='booking')
    def getBookingsForUser(self, request, pk=None):
        logger = logging.getLogger(logger_name)

        try:
            # # TODO: Add encryption to token
            # token = request.headers['Authorization'].split(" ")[1]
            # tokenData = jwt.decode(token, options={"verify_signature": False})
            # logger.info(f"userID : {tokenData['user_id']}")
            user = self.get_object()
            bookings = None
            print(user.type)
            if user.type == user_types.CR.value:
                print('Customer')
                bookings = Booking.objects.filter(customer=user)
            elif user.type == user_types.RM.value:
                print('Room Manager')
                bookings = Booking.objects.filter(room__manager=user)
            else: # Handle cases where user.type is neither CR nor RM
                bookings = Booking.objects.none() 
            bookingsDTO = BookingReadSerializer(bookings, many=True)
            return Response(bookingsDTO.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
# Views for web flow
def home(request):
    return render(request=request, template_name='user/homepage.html')
  
def register(request):
    return render(request=request, template_name='user/register.html')

def login(request):
    return render(request=request, template_name='user/login.html')

def index(request):
    return render(request=request, template_name='user/index.html')
