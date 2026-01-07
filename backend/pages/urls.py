from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PageViewSet, ContactMessageViewSet, ModerationQueueViewSet, AnnouncementViewSet

router = DefaultRouter()
router.register(r'pages', PageViewSet, basename='page')
router.register(r'moderation', ModerationQueueViewSet, basename='moderation')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')

urlpatterns = router.urls + [
    path('contact/', ContactMessageViewSet.as_view(), name='contact-message'),
]
