from django.db import models
from room.models import Room
from uuid import uuid4

# Create your models here.
class TimeSlot(models.Model) :
    id = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.ForeignKey(Room, models.CASCADE)        # One-to-Many relationship here, i.e : One Room can have many slots but many slots cannot have one Room associated with them.

    class Meta:
        unique_together = ('start_time', 'end_time', 'room')