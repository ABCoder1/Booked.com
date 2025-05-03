from django.db import models
from user.models import User
from uuid import uuid4

# Create your models here.
class Room(models.Model) :
    id = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    manager = models.ForeignKey(User, models.CASCADE)        # Because we will need to know the manager of every room
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=200)
    location = models.CharField(max_length=50)
    waiting_period = models.IntegerField(null=True)

    class Meta:
        unique_together = ('manager', 'name', 'description', 'location')