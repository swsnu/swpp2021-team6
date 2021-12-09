from django.db import models, transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from posts.models import Exercise, User_Exercise, Post
from datetime import datetime, timedelta


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
        user_id,
        nickname,
        latitude,
        longitude,
        gu,
        dong,
        gender,
        introduction,
        preferred_exercises,
    ):
        user = User.objects.get(id=user_id)

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
                Exercise, name=preferred_exercise["exerciseName"]
            )
            User_Exercise.objects.create(
                user=user,
                exercise=exercise,
                skill_level=preferred_exercise["skillLevel"],
            )

        return user


# Proxy user model
class ProxyUser(User):
    objects = CustomUserManager()

    class Meta:
        proxy = True


class Notification(models.Model):
    @property
    def created_string(self):
        time = datetime.now() - self.created_at

        if time < timedelta(minutes=1):
            return "방금 전"
        elif time < timedelta(hours=1):
            return str(int(time.seconds / 60)) + "분 전"
        elif time < timedelta(days=1):
            return str(int(time.seconds / 3600)) + "시간 전"
        elif time < timedelta(days=7):
            time = datetime.now().date() - self.created_at.date()
            return str(time.days) + "일 전"
        else:
            return str(time.days / 7) + "주 전"

    class NotiType(models.TextChoices):
        REQUEST_PARTICIPATION = "request participation"
        REQUEST_APPROVED = "request approved"
        REQUEST_DENIED = "request denied"
        COMMENT = "comment"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    noti_type = models.CharField(max_length=25, choices=NotiType.choices)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
