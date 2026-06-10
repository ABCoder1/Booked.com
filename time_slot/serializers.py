from rest_framework import serializers
from .models import TimeSlot
from room.models import Room

# TODO : Add validation methods

# Serializer for object creation
class TimeSlotCreateSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    class Meta:
        model = TimeSlot
        fields = '__all__'

    def create(self, validated_data):
        room = validated_data.pop('room')
        room = TimeSlot(room=room, **validated_data)
        room.save()
        return room
    
# Can skip optional arguments while updating the model object
class TimeSlotUpdateSerializer(serializers.ModelSerializer):
    room = serializers.ReadOnlyField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    class Meta:
        model = TimeSlot
        fields = '__all__'
    
# Same serializer for both list and retrieve
class TimeSlotReadSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    
    class Meta:
        model = TimeSlot
        exclude = ['room']