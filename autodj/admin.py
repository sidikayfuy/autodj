from django.contrib import admin
from . import models


admin.site.register(models.Audio)
admin.site.register(models.Words)
admin.site.register(models.Triggers)
admin.site.register(models.Scenaries)
admin.site.register(models.TriggerType)
admin.site.register(models.ComboTrigger)