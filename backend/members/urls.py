from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PublicMemberViewSet, MemberProfileViewSet, StaffMemberViewSet,
    MembershipApplicationViewSet, MembershipPaymentViewSet
)

router = DefaultRouter()
router.register(r'public/members', PublicMemberViewSet, basename='public-member')
router.register(r'profile', MemberProfileViewSet, basename='member-profile')
router.register(r'staff', StaffMemberViewSet, basename='staff')
router.register(r'applications', MembershipApplicationViewSet, basename='membership-application')
router.register(r'payments', MembershipPaymentViewSet, basename='membership-payment')

urlpatterns = router.urls
