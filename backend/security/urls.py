from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SecurityIncidentViewSet, AccessConstraintViewSet

router = DefaultRouter()
router.register(r'incidents', SecurityIncidentViewSet, basename='security-incident')
router.register(r'access-constraints', AccessConstraintViewSet, basename='access-constraint')

urlpatterns = router.urls
