from rest_framework import viewsets
from .models import Arsip
from .serializers import ArsipSerializer

class ArsipViewSet(viewsets.ModelViewSet):
    queryset = Arsip.objects.all()
    serializer_class = ArsipSerializer