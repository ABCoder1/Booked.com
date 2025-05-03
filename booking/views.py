from booking.models import Booking
from .serializers import BookingCreateSerializer, BookingReadSerializer
from django.db import IntegrityError
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
import uuid

logger_name = "root"

# Create your views here.
# Booking ViewSet for basic CRUD Handling
class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return BookingReadSerializer
        return BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        try:
            response_serializer =  BookingReadSerializer(booking)
            headers = self.get_success_headers(response_serializer.data)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError:
            return Response({'error': 'You have already created this booking.'}, status=status.HTTP_409_CONFLICT)

    def update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

# def get_room(request, room_id):
#     try :
#         room_dto = Room.objects.get(id=room_id)
#         return HttpResponse("The room requested is : %s" %room_id)
#     except Room.DoesNotExist :
#         return HttpResponse("The requested room doesn't exist.")

# def get_all_bookings(request): # Still need to add bookings table
#     latest_bookings =  Booking.objects.order_by('id')
#     context = {
#         'latest_bookings':latest_bookings,
#     }
#     return render(request=request, template_name='booking/all_bookings.html', context=context)

# def get_all_rooms(request):
#     latest_rooms =  Room.objects.order_by('id')
#     context = {
#         'latest_rooms':latest_rooms,
#     }
#     return render(request=request, template_name='booking/all_rooms.html', context=context)

# def get_all_rooms_for_user(request, user_name):
#     context = {}
#     if request.headers.get('Content-Length') != '':
#         user = User(username=user_name)
#         latest_rooms =  Room.objects.get(user=user)
#         context = {
#             'latest_rooms':latest_rooms,
#         }
#     return render(request=request, template_name='booking/all_rooms.html', context=context)

# def add_room(request):  # POST call to add a room by the room_manager
#     logger = logging.getLogger(logger_name)
#     if request.method == 'POST' :
#         if request.headers.get('Content-Length') != '':
#             params = parse_qs(request.body)
#             string_params = {}
#             for key, val in params.items() :
#                 string_params[key.decode('utf-8')] = [val_n.decode('utf-8') for val_n in val]
#             try:
#                 existing_room = Room.objects.get(name=string_params['name'][0])
#                 logger.error('room already exists : ', existing_room.name)
#                 return render(request=request, template_name='booking/all_rooms.html', context={'validation':'room with the same name already exists, please try something else'})
#             except Room.DoesNotExist:
#                 # TODO Get user here somehow to create room for that particular User(Room Manager)
#                 room = Room(id=uuid4(), name=string_params["name"][0], description=string_params["description"][0], location=string_params["location"][0])
#                 room.save()
#             return get_all_rooms_for_user(request=request)
#     # elif request.method == 'GET' :
#     return render(request=request, template_name='booking/add_room.html')