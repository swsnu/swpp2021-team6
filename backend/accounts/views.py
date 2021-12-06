import json
from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST, require_GET

from .models import Profile, ProxyUser
from .decorators import signin_required
from posts.models import User_Exercise, Post, Participation


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


@require_GET
@signin_required
def user_detail(request, user_id):
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
            "post_id": participation.post.id,
            "title": participation.post.title,
            "meet_at": participation.post.meet_at,
            "place_name": participation.post.place_name,
            "status": participation.post.status,
        }
        for participation in Participation.objects.filter(user=user)
    ]

    hosting_post = [
        {
            "post_id": post.id,
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
    return JsonResponse(response_dict, status=200)
