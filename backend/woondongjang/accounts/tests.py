from django.test import TestCase, Client
import json
from .models import ProxyUser

import sys

sys.path.append("..")
from posts.models import Exercise


class AccountsTestCase(TestCase):

    new_user = json.dumps(
        {
            "username": "username3",
            "password": "password3",
            "nickname": "닉네임3",
            "latitude": 37.47880163846696,
            "longitude": 126.94494429645442,
            "gu": "구3",
            "dong": "동3",
            "gender": "MALE",
            "introduction": "안ㄴ여하세여ㅁㄴ이ㅏ럼ㄴ아ㅣ러ㅣㅏㄴ어라ㅣㄴㅁ어리ㅏㅓㄴ이ㅏ럼ㄴ이러ㅏㅇ",
            "preferred_exercise": [
                {"exercise_name": "축구", "skill_level": "상"},
                {"exercise_name": "축구", "skill_level": "중"},
            ],
        }
    )

    def setUp(self):
        ProxyUser.objects.create_user_and_profile(
            username="username1",
            password="password1",
            nickname="닉네임1",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구1",
            dong="동1",
            gender="MALE",
            introduction="안녕하세요 user1입니다.",
        )
        ProxyUser.objects.create_user_and_profile(
            username="username2",
            password="password2",
            nickname="닉네임2",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구2",
            dong="동2",
            gender="FEMALE",
            introduction="안녕하세요 user2입니다.",
        )
        Exercise.objects.create(name="축구")

    def test_signup(self):
        client = Client()

        # 201 test (request successfully)
        response = client.post(
            "/users/signup", self.new_user, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        # 405 test
        response = client.get("/users/signup")
        self.assertEqual(response.status_code, 405)

    def test_signin(self):
        client = Client()

        # 405 test
        response = client.get("/users/signin")
        self.assertEqual(response.status_code, 405)

        # 401 test (when user is None)
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username3", "password": "password3"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)

        # 401 test (when user is None)
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password3"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

        # 204 test (request successfully)
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

    def test_signout(self):
        client = Client()

        # 405 test
        response = client.post("/users/signout", data=None)
        self.assertEqual(response.status_code, 405)

        # 401 test (user is None)
        response = client.get("/users/signout")
        self.assertEqual(response.status_code, 401)

        # 204 test (signout successfully)
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )
        response = client.get("/users/signout")
        self.assertEqual(response.status_code, 204)

    def test_user_detail(self):
        client = Client()
        # 401 test (user is None (get, post 둘다!)
        response = client.get("/users/1")
        self.assertEqual(response.status_code, 401)

        # 405 test
        response = client.post("/users/1", data=None)
        self.assertEqual(response.status_code, 405)
