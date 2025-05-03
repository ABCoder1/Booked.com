from rest_framework import serializers
from .models import User

# TODO : Add validation methods

# Serializer for object creation
class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        exclude = ['id']
        extra_kwargs = {'password': {'write_only': True}}  # Ensures that the password is not in read operations

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
# Can skip optional arguments while updating the model object
class UserUpdateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    username = serializers.ReadOnlyField()
    type = serializers.ReadOnlyField()
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(max_length=128, required=False)
    phone_number = serializers.IntegerField(required=False)

    class Meta:
        model = User
        fields = '__all__'
    
# Same serializer for both list and retrieve
class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'type', 'first_name', 'last_name']