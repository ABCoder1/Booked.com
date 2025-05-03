from django.db import models
from user.models import User
from room.models import Room
from time_slot.models import TimeSlot
from uuid import uuid4

# Create your models here. 
class Booking(models.Model):
    id = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    room = models.ForeignKey(Room, models.CASCADE)                # From the room_id itself, we can find out the Room Manager 
    customer = models.ForeignKey(User, models.CASCADE)            # Foreign key to User Table for customerID 
    slot = models.ForeignKey(TimeSlot, models.CASCADE)            # Foreign key to TimeSlot Table for SlotID     

    class Meta:
        unique_together = ('customer', 'room', 'slot')