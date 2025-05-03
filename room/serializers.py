from rest_framework import serializers
from .models import Room
from user.models import User

# TODO : Add validation methods

# Serializer for object creation
class RoomCreateSerializer(serializers.ModelSerializer):
    # manager_id = serializers.UUIDField(required=True)
    manager = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    name = serializers.CharField(max_length=50, required=True)
    description = serializers.CharField(max_length=200, required=True)
    location = serializers.CharField(max_length=50, required=True)
    waiting_period = serializers.IntegerField(required=True)

    class Meta:
        model = Room
        exclude = ['id']

    def create(self, validated_data):
        manager = validated_data.pop('manager')
        room = Room(manager=manager, **validated_data)
        room.save()
        return room
    
# Can skip optional arguments while updating the model object
class RoomUpdateSerializer(serializers.ModelSerializer):
    manager = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField()
    name = serializers.CharField(max_length=50, required=False)
    description = serializers.CharField(max_length=200, required=False)
    location = serializers.CharField(max_length=50, required=False)
    waiting_period = serializers.IntegerField(required=False)

    class Meta:
        model = Room
        fields = '__all__'
    
# Same serializer for both list and retrieve
class RoomReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['manager_id', 'description', 'location', 'waiting_period']