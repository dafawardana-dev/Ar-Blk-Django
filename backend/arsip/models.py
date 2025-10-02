# backend/arsip/models.py
from django.db import models

class Arsip(models.Model):
    nama = models.CharField(max_length=255, verbose_name="Nama Arsip")
    deskripsi = models.TextField(blank=True, null=True, verbose_name="Deskripsi")
    tanggal = models.DateField(verbose_name="Tanggal Arsip")

    def __str__(self):
        return self.nama

    class Meta:
        verbose_name = "Arsip"
        verbose_name_plural = "Arsip"