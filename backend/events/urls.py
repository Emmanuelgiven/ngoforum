from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicEventViewSet, EventViewSet, EventAttendanceViewSet

router = DefaultRouter()
router.register(r'public/events', PublicEventViewSet, basename='public-event')
router.register(r'events', EventViewSet, basename='event')
router.register(r'attendances', EventAttendanceViewSet, basename='event-attendance')

urlpatterns = router.urls
