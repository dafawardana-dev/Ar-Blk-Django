# backend/arsip/serializers.py
from rest_framework import serializers
from .models import Arsip

class ArsipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Arsip
        fields = '__all__'