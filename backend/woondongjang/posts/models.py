from django.db import models, transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .ml.ibm_cloud import extract_keywords


class Exercise(models.Model):
    name = models.CharField(max_length=20)


class PostManager(models.Manager):
    @transaction.atomic
    def create_post(
        self,
        host,
        exercise_name,
        title,
        description,
        expected_level,
        meet_at,
        latitude,
        longitude,
        gu,
        dong,
        place_name,
        place_address,
        place_telephone,
        min_capacity,
        max_capacity,
        kakaotalk_link,
    ):
        exercise = get_object_or_404(Exercise, name=exercise_name)

        # Post 생성
        new_post = self.create(
            host=host,
            exercise=exercise,
            title=title,
            description=description,
            expected_level=expected_level,
            meet_at=meet_at,
            latitude=latitude,
            longitude=longitude,
            gu=gu,
            dong=dong,
            place_name=place_name,
            place_address=place_address,
            place_telephone=place_telephone,
            min_capacity=min_capacity,
            max_capacity=max_capacity,
            kakaotalk_link=kakaotalk_link,
        )

        keywords = extract_keywords(description)

        # Post_Keyword 생성
        Post_Keyword.objects.create(
            post=new_post,
            keyword1=keywords[0],
            keyword2=keywords[1],
            keyword3=keywords[2],
        )

        return new_post


class Post(models.Model):
    objects = PostManager()

    class Status(models.TextChoices):
        RECRUITING = "모집 중"
        RECRUITED = "모집 완료"

    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.TextField(default="")
    description = models.TextField(default="")
    expected_level = models.CharField(max_length=20)
    meet_at = models.DateTimeField()
    latitude = models.DecimalField(max_digits=19, decimal_places=16)
    longitude = models.DecimalField(max_digits=19, decimal_places=16)
    gu = models.CharField(max_length=20)
    dong = models.CharField(max_length=20)
    place_name = models.CharField(max_length=32)
    place_address = models.CharField(max_length=64)
    place_telephone = models.CharField(max_length=20)
    min_capacity = models.IntegerField()
    max_capacity = models.IntegerField()
    member_count = models.IntegerField(default=0)
    kakaotalk_link = models.CharField(max_length=256)
    status = models.CharField(
        max_length=5, choices=Status.choices, default=Status.RECRUITING
    )
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class Post_Keyword(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    keyword1 = models.TextField(default="")
    keyword2 = models.TextField(default="")
    keyword3 = models.TextField(default="")


class Participation(models.Model):
    class Status(models.TextChoices):
        PENDING = "승인 대기 중"
        ACCEPTED = "참가 중"
        DECLINED = "거절됨"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now=True)


class User_Exercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    skill_level = models.CharField(max_length=20)


class Comment(models.Model):
    author = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now=True)
