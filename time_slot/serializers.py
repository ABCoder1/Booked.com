from rest_framework import serializers
from .models import TimeSlot
from room.models import Room

# TODO : Add validation methods

# Serializer for object creation
class TimeSlotCreateSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    start_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])  # Input/Output in 12-hour format
    end_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])    # Input/Output in 12-hour format

    class Meta:
        model = TimeSlot
        exclude = ['id']

    def create(self, validated_data):
        room = validated_data.pop('room')
        room = TimeSlot(room=room, **validated_data)
        room.save()
        return room
    
# Can skip optional arguments while updating the model object
class TimeSlotUpdateSerializer(serializers.ModelSerializer):
    room = serializers.ReadOnlyField()
    start_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])  # Input/Output in 12-hour format
    end_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])    # Input/Output in 12-hour format

    class Meta:
        model = TimeSlot
        fields = '__all__'
    
# Same serializer for both list and retrieve
class TimeSlotReadSerializer(serializers.ModelSerializer):
    start_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])  # Input/Output in 12-hour format
    end_time = serializers.TimeField(format='%I:%M %p', input_formats=['%I:%M %p', '%H:%M', '%I:%M%p', '%I:%M %P', '%H:%M:%S'])    # Input/Output in 12-hour format

    class Meta:
        model = TimeSlot
        fields = ['start_time', 'end_time']