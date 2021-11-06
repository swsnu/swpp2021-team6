from json.decoder import JSONDecodeError
from django.http.response import HttpResponse, HttpResponseNotAllowed
import json
from .models import Profile, ProxyUser
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def signup(request):
    def is_valid():
        if gender not in Profile.Gender.names:
            return False
        return False

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

        if not is_valid():
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
