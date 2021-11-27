from django.db import models, transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from posts.models import Exercise, User_Exercise, Post


class Profile(models.Model):
    # https://docs.djangoproject.com/en/3.2/ref/models/fields/#enumeration-types
    class Gender(models.TextChoices):
        MALE = "남성"
        FEMALE = "여성"

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=20, unique=True)
    latitude = models.DecimalField(
        max_digits=19, decimal_places=16, default=37.44909866025764
    )
    longitude = models.DecimalField(
        max_digits=19, decimal_places=16, default=126.95209764127841
    )
    gu = models.CharField(max_length=20, default="관악구")
    dong = models.CharField(max_length=20, default="신림동")
    gender = models.CharField(max_length=2, choices=Gender.choices)
    introduction = models.TextField(blank=True)


# Custom manager for proxy user model
class CustomUserManager(models.Manager):
    @transaction.atomic
    def create_user_with(
        self,
        username,
        password,
        nickname,
        latitude,
        longitude,
        gu,
        dong,
        gender,
        introduction,
        preferred_exercises,
    ):
        user = User.objects.create_user(username=username, password=password)

        Profile.objects.create(
            user=user,
            nickname=nickname,
            latitude=latitude,
            longitude=longitude,
            gu=gu,
            dong=dong,
            gender=gender,
            introduction=introduction,
        )

        for preferred_exercise in preferred_exercises:
            exercise = get_object_or_404(
                Exercise, name=preferred_exercise["exercise_name"]
            )
            User_Exercise.objects.create(
                user=user,
                exercise=exercise,
                skill_level=preferred_exercise["skill_level"],
            )

        return user


# Proxy user model
class ProxyUser(User):
    objects = CustomUserManager()

    class Meta:
        proxy = True


class Notification(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    noti_type = models.CharField(max_length=30)
    is_read = models.BooleanField(default=False)
