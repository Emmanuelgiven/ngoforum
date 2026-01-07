from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicJobAdvertisementViewSet, JobAdvertisementViewSet,
    PublicTrainingViewSet, TrainingViewSet,
    PublicTenderAdvertisementViewSet, TenderAdvertisementViewSet
)

router = DefaultRouter()
router.register(r'public/jobs', PublicJobAdvertisementViewSet, basename='public-job')
router.register(r'jobs', JobAdvertisementViewSet, basename='job')
router.register(r'public/trainings', PublicTrainingViewSet, basename='public-training')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'public/tenders', PublicTenderAdvertisementViewSet, basename='public-tender')
router.register(r'tenders', TenderAdvertisementViewSet, basename='tender')

urlpatterns = router.urls
