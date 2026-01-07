from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StateViewSet, CountyViewSet, SectorViewSet,
    PublicOperationalPresenceViewSet, OperationalPresenceViewSet
)

router = DefaultRouter()
router.register(r'states', StateViewSet, basename='state')
router.register(r'counties', CountyViewSet, basename='county')
router.register(r'sectors', SectorViewSet, basename='sector')
router.register(r'public/operational-presence', PublicOperationalPresenceViewSet, basename='public-operational-presence')
router.register(r'operational-presence', OperationalPresenceViewSet, basename='operational-presence')

urlpatterns = router.urls
