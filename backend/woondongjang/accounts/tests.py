from django.test import TestCase, Client
import json
from .models import ProxyUser
from django.utils import timezone

import sys

sys.path.append("..")
from posts.models import Exercise, User_Exercise, Participation, Post


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

    new_user2 = json.dumps(
        {
            "username": "username4",
            "password": "password4",
            "nickname": "닉네임4",
            "latitude": 37.47880163846696,
            "longitude": 126.94494429645442,
            "gu": "구4",
            "dong": "동4",
            "gender": "M",
            "introduction": "gender type이 enum에 맞지 않는 corner case입니다.",
            "preferred_exercise": [
                {"exercise_name": "축구", "skill_level": "상"},
                {"exercise_name": "축구", "skill_level": "중"},
            ],
        }
    )
    new_user3 = json.dumps(
        {
            "username": "username5",
        }
    )

    def setUp(self):
        test_user1 = ProxyUser.objects.create_user_and_profile(
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
        test_user2 = ProxyUser.objects.create_user_and_profile(
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
        test_exercise1 = Exercise.objects.create(name="축구")
        User_Exercise.objects.create(
            user=test_user1, exercise=test_exercise1, skill_level="상"
        )
        test_post2 = Post.objects.create(
            exercise=test_exercise1,
            host=test_user2,
            title="post2 title",
            description="post2 description",
            expected_level="상",
            meet_at=timezone.now(),
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구2",
            dong="동2",
            place_name="운동장2",
            place_address="주소2",
            place_telephone="전화번호2",
            min_capacity=10,
            max_capacity=5,
            kakaotalk_link="kakaotalk link 2",
        )
        Participation.objects.create(user=test_user1, post=test_post2)

    def test_signup(self):
        client = Client()

        # 201 test (request successfully)
        response = client.post(
            "/users/signup", self.new_user, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

        # gender type이 enum에 맞지 않는 case
        response = client.post(
            "/users/signup", self.new_user2, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # KeyError test
        response = client.post(
            "/users/signup", self.new_user3, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

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

        # 400 test (KeyError test)
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password3"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 401)

        # 400 test (when user is None)
        response = client.post(
            "/users/signin",
            self.new_user3,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

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

        # after signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # 200 test (get)
        response = client.get("/users/1")
        self.assertEqual(response.status_code, 200)
