from room.models import Room
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import RoomCreateSerializer, RoomUpdateSerializer, RoomReadSerializer
import uuid
import logging

logger_name = "root"

# Create your views here.
# Room ViewSet for basic CRUD Handling
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RoomReadSerializer
        elif self.action == 'update':
            return RoomUpdateSerializer
        return RoomCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        room = serializer.save()
        response_serializer =  RoomReadSerializer(room)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Handling partial updates (PATCH)
        instance = self.get_object() # Gets the user object we are updating from DB
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_serializer = RoomReadSerializer(instance)
        return Response(response_serializer.data)