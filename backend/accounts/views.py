import json
from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from posts.models import Exercise, User_Exercise, Post, Participation
from .models import Notification, Profile, ProxyUser
from .decorators import signin_required


@require_POST
def signup(request):
    req_data = json.loads(request.body.decode())
    username = req_data["username"]
    password = req_data["password"]
    user = User.objects.create_user(username=username, password=password)
    return JsonResponse({"userId": user.id}, safe=False, status=201)


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
        # "nickname": user.profile.nickname,
        # "latitude": user.profile.latitude,
        # "longitude": user.profile.longitude,
    }
    return JsonResponse(response_dict, safe=False, status=200)


@require_GET
@signin_required
def signout(request):
    logout(request)

    return HttpResponse(status=204)


@require_GET
def get_user_detail(request, user_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = User.objects.get(id=user_id)

    preferred_exercise = [
        {
            "exercise_name": preferred_exercise.exercise.name,
            "skill_level": preferred_exercise.skill_level,
        }
        for preferred_exercise in User_Exercise.objects.filter(user=user)
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
        for participation in Participation.objects.filter(user=user).order_by('-status', 'post__meet_at')
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
        for post in Post.objects.filter(host=user).order_by('-status', 'meet_at')
    ]

    response_dict = {
        "user_id": user.id,
        "nickname": user.profile.nickname,
        "latitude": user.profile.latitude,
        "longitude": user.profile.longitude,
        "gu": user.profile.gu,
        "dong": user.profile.dong,
        "gender": user.profile.gender,
        "introduction": user.profile.introduction,
        "preferred_exercise": preferred_exercise,
        "participating_post": participating_post,
        "hosting_post": hosting_post,
    }

    return JsonResponse(response_dict, status=200)


@require_http_methods(["POST", "PATCH"])
def user_detail(request, user_id):
    if request.method == "POST":

        def is_request_valid():
            if gender not in Profile.Gender.values:
                return False
            return True

        try:
            req_dict = json.loads(request.body.decode())
            nickname = req_dict["nickname"]
            latitude = req_dict["latitude"]
            longitude = req_dict["longitude"]
            gu = req_dict["gu"]
            dong = req_dict["dong"]
            gender = req_dict["gender"]
            introduction = req_dict["introduction"]
            preferred_exercises = req_dict["preferredExercise"]

        except (KeyError, JSONDecodeError):
            return HttpResponse(status=400)

        if not is_request_valid():
            return HttpResponse(status=400)

        ProxyUser.objects.create_user_with(
            user_id,
            nickname,
            latitude,
            longitude,
            gu,
            dong,
            gender,
            introduction,
            preferred_exercises,
        )

        user = User.objects.get(id=user_id)

        login(request, user)

        return HttpResponse(status=201)

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
        for preferred_exercise in req_data["preferredExercise"]:
            exercise = get_object_or_404(
                Exercise, name=preferred_exercise["exerciseName"]
            )
            User_Exercise.objects.create(
                user=user,
                exercise=exercise,
                skill_level=preferred_exercise["skillLevel"],
            )

        return HttpResponse(status=200)


@require_GET
@signin_required
def get_notification(request, user_id):
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


@require_GET
def read_notification(request, noti_id):
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


# 응답 헤더 Set-Cookie: csrftoken=...
@require_GET
@ensure_csrf_cookie
def set_csrftoken(request):
    return HttpResponse(status=204)
