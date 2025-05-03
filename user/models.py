from django.db import models
from django.contrib.auth.models import AbstractUser
from enum import Enum
from uuid import uuid4

class user_types(Enum):
    CR = "CUSTOMER"
    RM = "ROOM_MANAGER"

# Create your models here.
class User(AbstractUser) :
    id = models.UUIDField(default=uuid4, editable=False, primary_key=True)
    phone_number = models.IntegerField()
    type = models.CharField(choices=[(user_type.value, user_type.value) for user_type in user_types], max_length=13)