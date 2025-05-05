import logging
from uuid import uuid4
from urllib.parse import parse_qs
from .models import User, user_types
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import UserCreateSerializer, UserReadSerializer, UserUpdateSerializer

logger_name = "root"

# Create your views here.

# User ViewSet for basic CRUD Handling
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserReadSerializer
        elif self.action == 'update':
            return UserUpdateSerializer
        return UserCreateSerializer

    def get_permissions(self):
        if self.request.method == 'POST':  # POST = create
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_authenticators(self):
        if self.request.method == 'POST':  # POST = create
            return []
        return [JWTAuthentication()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_serializer = UserReadSerializer(user)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_serializer = UserReadSerializer(instance)
        return Response(response_serializer.data)

# Views for web flow
def home(request):
    return render(request=request, template_name='user/homepage.html')
  
def register(request):
    return render(request=request, template_name='user/register.html')

def login(request):
    return render(request=request, template_name='user/login.html')

def index(request):
    return render(request=request, template_name='user/index.html')

# def register(request):
#     logger = logging.getLogger(logger_name)
#     if request.method == 'POST' :
#         if request.headers.get('Content-Length') != '':
#             params = parse_qs(request.body)
#             string_params = {}
#             for key, val in params.items() :
#                 string_params[key.decode('utf-8')] = [val_n.decode('utf-8') for val_n in val]
            
#             try:
#                 existing_user = User.objects.get(username=string_params['username'][0])
#                 logger.error('username already exists : ', existing_user.username)
#                 return render(request=request, template_name='user/register.html', context={'validation':'username already exists, please try something else'})
#             except User.DoesNotExist:
#                 type_param = string_params["user_type"][0]
#                 if type_param == 'customer' :
#                     type_for_user = user_types.CR
#                 elif type_param == 'manager' :
#                     type_for_user = user_types.RM
#                 else :
#                     return render(request=request, template_name='user/register.html', context={'validation':'invalid user type, please try again'})
                
#                 data = {
#                     'id':uuid4().hex,
#                     'name':string_params["name"][0],
#                     'username':string_params["username"][0],
#                     'phone_number':string_params["phone_number"][0],
#                     'type':type_for_user.value,
#                     'password':string_params["password"][0]
#                 }
                
#                 logger.info('userType : ', data['type'])
                
#                 user = UserCreateSerializer(data=data)
#                 if user.is_valid() :
#                     new_user = user.save()
#                     return index(request=request, user=new_user)
#                 logger.error('invalid user params : ', user.errors)
#                 render(request=request, template_name='user/register.html',context={'validation':user.errors})
#         return render(request=request, template_name='user/register.html', context={'validation':'missing payload'})
#     return render(request=request, template_name='user/register.html')

# def login(request):
    # if request.method == 'POST' :
    #     if request.headers.get('Content-Length') != '':
    #         params = parse_qs(request.body)
    #         request_dto = {}
    #         for key, val in params.items() :
    #             request_dto[key.decode('utf-8')] = val[0].decode('utf-8')
            
    #         try:
    #             user = User.objects.get(username=request_dto['username'])
    #         except User.DoesNotExist:
    #             return render(request=request, template_name='user/login.html',context={'validation':'user doesnt exist, try registering first'})
    #         else:
    #             if user.password == request_dto['password'] :
    #                 return index(request=request, user=user)
    #             else:
    #                 return render(request=request, template_name='user/login.html',context={'validation':'invalid username/password'})
    #     return render(request=request, template_name='user/login.html',context={'validation':'missing payload'})
    # return render(request=request, template_name='user/login.html')

# def index(request, user):
    # logger = logging.getLogger(logger_name)
    # if user.type == user_types.CR.value :
    #     logger.info('customer login')
    #     return render(request=request, template_name='user/customer.html', context={'user':user})
    # elif user.type == user_types.RM.value :
    #     logger.info('room manager login')
    #     return render(request=request, template_name='user/room_manager.html', context={'user':user})
    # logger.error('didnt match')
    # return render(request=request, template_name='user/index.html', context={'user':user})

# def get_user(request, user_id):
#     user = get_object_or_404(User, pk=user_id)
#     return render(request=request, template_name='user/userdetails.html', context={'user':user})

# def get_all_users(request):
#     latest_users =  User.objects.order_by('id')
#     context = {
#         'latest_users':latest_users,
#     }
#     return render(request=request, template_name='user/allusers.html', context=context)