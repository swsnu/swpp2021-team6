from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, HttpResponseNotAllowed, JsonResponse
import json
import sys
from .models import Profile, ProxyUser
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST, require_GET

sys.path.append("..")
from posts.models import User_Exercise, Exercise, Post, Participation


@require_POST
def signup(request):
    def is_request_valid():
        if gender not in Profile.Gender.names:
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

    except (KeyError, JSONDecodeError):
        return HttpResponse(status=400)

    if not is_request_valid():
        return HttpResponse(status=400)

    ProxyUser.objects.create_user_and_profile(
        username,
        password,
        nickname,
        latitude,
        longitude,
        gu,
        dong,
        gender,
        introduction,
    )

    preferred_exercise = req_dict["preferred_exercise"]
    user = User.objects.get(username=username)
    for each in preferred_exercise:
        exercise = Exercise.objects.get(name=each["exercise_name"])
        new_user_exercise = User_Exercise(
            user=user, exercise=exercise, skill_level=each["skill_level"]
        )
        new_user_exercise.save()

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
    if not ProxyUser.objects.filter(username=username).exists():
        return HttpResponse(status=404)

    # username은 존재하지만 password가 틀림
    user = authenticate(request, username=username, password=password)
    if user is None:
        return HttpResponse(status=401)

    response_dict = {
        "id": user.id,
        "nickname": user.profile.nickname,
        "latitude": user.profile.latitude,
        "longitude": user.profile.longitude,
        "gu": user.profile.gu,
        "dong": user.profile.dong,
        "gender": user.profile.gender,
    }
    login(request, user)
    return JsonResponse(response_dict, safe=False, status=200)


@require_GET
def signout(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    logout(request)
    return HttpResponse(status=204)


@require_GET
def user_detail(request, user_id=0):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    user = User.objects.get(id=user_id)

    user_exercise = [
        {
            "exercise_name": each_exercise.exercise.name,
            "skill_level": each_exercise.skill_level,
        }
        for each_exercise in User_Exercise.objects.filter(user=user)
    ]

    participating_post = [
        {
            "post_id": each_participation.post.id,
            "title": each_participation.post.title,
            "meet_at": each_participation.post.meet_at,
            "place_name": each_participation.post.place_name,
            "status": each_participation.post.status,
        }
        for each_participation in Participation.objects.filter(user=user)
    ]

    hosting_post = [
        {
            "post_id": each_hosting_post.id,
            "title": each_hosting_post.title,
            "meet_at": each_hosting_post.meet_at,
            "place_name": each_hosting_post.place_name,
            "status": each_hosting_post.status,
        }
        for each_hosting_post in Post.objects.filter(host=user)
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
    return JsonResponse(response_dict, status=200)
