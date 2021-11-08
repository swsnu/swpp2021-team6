from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, HttpResponseNotAllowed
import json
from .models import Profile, ProxyUser
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout


@csrf_exempt
def signup(request):
    def is_request_valid():
        if gender not in Profile.Gender.names:
            return False
        return True

    if request.method == "POST":
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
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(["POST"])


@csrf_exempt
def signin(request):
    if request.method == "POST":
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

        login(request, user)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["POST"])


@csrf_exempt
def signout(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        logout(request)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])
