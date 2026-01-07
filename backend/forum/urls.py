from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ForumCategoryViewSet, PublicForumPostViewSet, ForumPostViewSet, ForumCommentViewSet
)

router = DefaultRouter()
router.register(r'categories', ForumCategoryViewSet, basename='forum-category')
router.register(r'public/posts', PublicForumPostViewSet, basename='public-forum-post')
router.register(r'posts', ForumPostViewSet, basename='forum-post')
router.register(r'comments', ForumCommentViewSet, basename='forum-comment')

urlpatterns = router.urls
