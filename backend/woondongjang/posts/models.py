from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Exercise(models.Model):
    name = models.CharField(max_length=20)


# Create your models here.
class Post(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.TextField(default="")
    description = models.TextField(default="")
    meet_at = models.DateTimeField()
    latitude = models.DecimalField(max_digits=19, decimal_places=16)
    longitude = models.DecimalField(max_digits=19, decimal_places=16)
    gu = models.CharField(max_length=20)
    dong = models.CharField(max_length=20)
    place = models.CharField(max_length=20)
    capacity = models.IntegerField()
    member_count = models.IntegerField(default=0)
    kakaotalk_link = models.CharField(max_length=256)
    status = models.CharField(max_length=20, default="Recruiting")
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now=True)


class User_Exercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    skill_level = models.IntegerField()


class Comment(models.Model):
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
