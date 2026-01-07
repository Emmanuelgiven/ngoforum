from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResourceCategoryViewSet, PublicResourceViewSet, ResourceViewSet,
    FAQCategoryViewSet, FAQViewSet
)

router = DefaultRouter()
router.register(r'categories', ResourceCategoryViewSet, basename='resource-category')
router.register(r'public/resources', PublicResourceViewSet, basename='public-resource')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'faq-categories', FAQCategoryViewSet, basename='faq-category')
router.register(r'faqs', FAQViewSet, basename='faq')

urlpatterns = router.urls
