# backend/arsip/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArsipViewSet

router = DefaultRouter()
router.register(r'arsip', ArsipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]