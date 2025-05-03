from django.urls import path
from booking import views

from booking import views

app_name = 'booking'

urlpatterns = [
    path('room/add', views.add_room, name='add_room'),
    path('room/<int:room_id>', views.get_room, name='get_room'),
    path('room/all', views.get_all_rooms, name='get_all_rooms'),
    path('bookings/all', views.get_all_bookings, name='get_all_bookings')
]