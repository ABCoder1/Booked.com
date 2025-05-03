from time_slot.models import TimeSlot
from .serializers import TimeSlotCreateSerializer, TimeSlotUpdateSerializer, TimeSlotReadSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
import uuid
import logging

logger_name = "root"

# Create your views here.
# TimeSlot ViewSet for basic CRUD Handling
class TimeSlotViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = TimeSlot.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TimeSlotReadSerializer
        elif self.action == 'update':
            return TimeSlotUpdateSerializer
        return TimeSlotCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        time_slot = serializer.save()
        response_serializer =  TimeSlotReadSerializer(time_slot)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # Handling partial updates (PATCH)
        instance = self.get_object() # Gets the user object we are updating from DB
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_serializer = TimeSlotReadSerializer(instance)
        return Response(response_serializer.data)