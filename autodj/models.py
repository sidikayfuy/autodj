from django.db import models
from django.contrib.auth.models import User


class Audio(models.Model):
    file = models.FileField(upload_to='audio/')

    def __str__(self):
        return self.file.name


class Words(models.Model):
    word = models.CharField(max_length=100)

    def __str__(self):
        return self.word


class TriggerType(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type


class Triggers(models.Model):
    words = models.ManyToManyField(Words, default=None)
    file = models.ManyToManyField(Audio)
    type = models.ForeignKey(TriggerType, on_delete=models.CASCADE, default=None)
    author = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    desc = models.CharField(max_length=200)


    def __str__(self):
        return self.desc


class ComboTrigger(models.Model):
    parent = models.ForeignKey(Triggers, on_delete=models.CASCADE, default=None)
    childrens = models.ManyToManyField(Triggers, related_name='child')

    def __str__(self):
        return self.parent.desc



class Scenaries(models.Model):
    title = models.CharField(max_length=100)
    maker = models.ForeignKey(User, on_delete=models.CASCADE)
    triggers = models.ManyToManyField(Triggers)
    combo_triggers = models.ManyToManyField(ComboTrigger)

    def __str__(self):
        return self.title

