import json
from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET, require_http_methods

from .models import Notification, Profile, ProxyUser
from .decorators import signin_required
from posts.models import Exercise, User_Exercise, Post, Participation


@require_POST
def signup(request):
    def is_request_valid():
        # ['남성', '여성']
        if gender not in Profile.Gender.values:
            return False
        return True

    try:
        req_dict = json.loads(request.body.decode())
        username = req_dict["username"]
        password = req_dict["password"]
        nickname = req_dict["nickname"]
        latitude = req_dict["latitude"]
        longitude = req_dict["longitude"]
        gu = req_dict["gu"]
        dong = req_dict["dong"]
        gender = req_dict["gender"]
        introduction = req_dict["introduction"]
        preferred_exercises = req_dict["preferred_exercises"]
    except (KeyError, JSONDecodeError):
        return HttpResponse(status=400)

    if not is_request_valid():
        return HttpResponse(status=400)

    ProxyUser.objects.create_user_with(
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
    )

    return HttpResponse(status=201)


@require_POST
def signin(request):
    try:
        req_dict = json.loads(request.body.decode())
        username = req_dict["username"]
        password = req_dict["password"]
    except (KeyError, JSONDecodeError):
        return HttpResponse(status=400)

    # username이 존재하지 않음
    if not User.objects.filter(username=username).exists():
        return HttpResponse(status=404)

    # username은 존재하지만 password가 틀림
    user = authenticate(request, username=username, password=password)
    if user is None:
        return HttpResponse(status=401)

    login(request, user)

    response_dict = {
        "user_id": user.id,
        "nickname": user.profile.nickname,
        "latitude": user.profile.latitude,
        "longitude": user.profile.longitude,
    }
    return JsonResponse(response_dict, safe=False, status=200)


@require_GET
@signin_required
def signout(request):
    logout(request)

    return HttpResponse(status=204)


@require_http_methods(["GET", "PATCH"])
@signin_required
def user_detail(request, user_id):
    if request.method == "GET":
        user = User.objects.get(id=user_id)

        user_exercise = [
            {
                "exercise_name": user_exercise.exercise.name,
                "skill_level": user_exercise.skill_level,
            }
            for user_exercise in User_Exercise.objects.filter(user=user)
        ]

        participating_post = [
            {
                "host_name": participation.post.host.profile.nickname,
                "post_id": participation.post.id,
                "exercise_name": participation.post.exercise.name,
                "title": participation.post.title,
                "meet_at": participation.post.meet_at,
                "place_name": participation.post.place_name,
                "status": participation.status,
            }
            for participation in Participation.objects.filter(user=user)
        ]

        hosting_post = [
            {
                "host_name": post.host.profile.nickname,
                "post_id": post.id,
                "exercise_name": post.exercise.name,
                "title": post.title,
                "meet_at": post.meet_at,
                "place_name": post.place_name,
                "status": post.status,
            }
            for post in Post.objects.filter(host=user)
        ]

        response_dict = {
            "user_id": user.id,
            "nickname": user.profile.nickname,
            "gu": user.profile.gu,
            "dong": user.profile.dong,
            "gender": user.profile.gender,
            "introduction": user.profile.introduction,
            "user_exercise": user_exercise,
            "participating_post": participating_post,
            "hosting_post": hosting_post,
        }
        print(response_dict)
        return JsonResponse(response_dict, status=200)

    elif request.method == "PATCH":
        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        req_data = json.loads(request.body.decode())
        profile.nickname = req_data["nickname"]
        profile.gu = req_data["gu"]
        profile.dong = req_data["dong"]
        profile.introduction = req_data["introduction"]
        profile.save()

        User_Exercise.objects.filter(user=user).delete()
        for preferred_exercise in req_data["userExercise"]:
            exercise = get_object_or_404(
                Exercise, name=preferred_exercise["exerciseName"]
            )
            User_Exercise.objects.create(
                user=user,
                exercise=exercise,
                skill_level=preferred_exercise["skillLevel"],
            )

        return HttpResponse(status=200)


@require_POST
@signin_required
def create_notification(request, user_id, post_id, noti_type):
    if request.method == "POST":
        user = User.objects.get(id=user_id)
        post = Post.objects.get(id=post_id)
        new_notification = Notification.objects.create(
            user=user,
            post=post,
            noti_type=noti_type,
        )
        new_notification.save()

        return HttpResponse(status=201)

    return


@require_GET
@signin_required
def get_notification(request, user_id):
    if request.method == "GET":
        user = User.objects.get(id=user_id)
        noti_list = [
            {
                "noti_id": noti.id,
                "noti_type": noti.noti_type,
                "post_id": noti.post.id,
                "post_title": noti.post.title,
                "is_read": noti.is_read,
                "created_at": noti.created_string,
            }
            for noti in Notification.objects.filter(user=user).order_by("-created_at")
        ]

        return JsonResponse(noti_list, status=201, safe=False)


def read_notification(request, noti_id):
    if request.method == "PATCH":
        target_noti = Notification.objects.get(id=noti_id)
        target_noti.is_read = True
        target_noti.save()
        noti_list = [
            {
                "noti_id": noti.id,
                "noti_type": noti.noti_type,
                "post_id": noti.post.id,
                "post_title": noti.post.title,
                "is_read": noti.is_read,
                "created_at": noti.created_string,
            }
            for noti in Notification.objects.filter(user=request.user).order_by(
                "-created_at"
            )
        ]
        return JsonResponse(noti_list, status=200, safe=False)
