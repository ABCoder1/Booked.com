from rest_framework import serializers
from .models import Booking
from room.models import Room
from user.models import User
from time_slot.models import TimeSlot

# TODO : Add validation methods

# Serializer for object creation
class BookingCreateSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    slot = serializers.PrimaryKeyRelatedField(queryset=TimeSlot.objects.all())

    class Meta:
        model = Booking
        exclude = ['id']

    def create(self, validated_data):
        customer = validated_data.pop('customer')
        room = validated_data.pop('room')
        slot = validated_data.pop('slot')

        booking = Booking(customer=customer, room=room, slot=slot, **validated_data)
        booking.save()
        return booking

# TODO : Revise the Booking update functionality, as of now blocked
 
# # Can skip optional arguments while updating the model object
# class BookingUpdateSerializer(serializers.ModelSerializer):
#     manager = serializers.ReadOnlyField()
#     id = serializers.ReadOnlyField()
#     name = serializers.CharField(max_length=50, required=False)
#     description = serializers.CharField(max_length=200, required=False)
#     location = serializers.CharField(max_length=50, required=False)
#     waiting_period = serializers.IntegerField(required=False)

#     class Meta:
#         model = Room
#         fields = '__all__'
    
# Same serializer for both list and retrieve
class BookingReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['room', 'customer', 'slot']