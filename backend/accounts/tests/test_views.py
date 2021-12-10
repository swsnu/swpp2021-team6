from django.contrib.auth.models import User
from django.http import response
from django.test import TestCase, Client
from django.utils import timezone
import json

from ..models import Notification, ProxyUser
from posts.models import Exercise, Participation, Post


class AccountsTestCase(TestCase):
    new_user3 = json.dumps(
        {
            "username": "username3",
            "password": "password3"
        }
    )
    new_user3_profile = json.dumps(
        {
            "user_id": 3,
            "nickname": "닉네임3",
            "latitude": 37.47880163846696,
            "longitude": 126.94494429645442,
            "gu": "구3",
            "dong": "동3",
            "gender": "남성",
            "introduction": "안ㄴ여하세여ㅁㄴ이ㅏ럼ㄴ아ㅣ러ㅣㅏㄴ어라ㅣㄴㅁ어리ㅏㅓㄴ이ㅏ럼ㄴ이러ㅏㅇ",
            "preferredExercise": [
                {"exerciseName": "축구", "skillLevel": "상"},
                {"exerciseName": "축구", "skillLevel": "중"},
            ],
        }
    )
    new_user4 = json.dumps({
        "username": "username4",
        "password": "password4"
    })

    new_user4_profile = json.dumps(
        {
            "userId": 4,
            "nickname": "닉네임4",
            "latitude": 37.47880163846696,
            "longitude": 126.94494429645442,
            "gu": "구4",
            "dong": "동4",
            "gender": "M",
            "introduction": "gender type이 enum에 맞지 않는 corner case입니다.",
            "preferredExercise": [
                {"exerciseName": "축구", "skillLevel": "상"},
                {"exerciseName": "축구", "skillLevel": "중"},
            ],
        }
    )
    new_user5 = json.dumps({
        "username": "username5",
    })
    new_user5_profile = json.dumps(
        {
            "username": "username5",
        }
    )

    def setUp(self):
        test_exercise = Exercise.objects.create(name="축구")
        test_user1 = User.objects.create_user(
            username="username1", password="password1")
        test_user1 = ProxyUser.objects.create_user_with(
            user_id=test_user1.id,
            nickname="닉네임1",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구1",
            dong="동1",
            gender="남성",
            introduction="안녕하세요 user1입니다.",
            preferred_exercises=[{"exerciseName": "축구", "skillLevel": "중"}],
        )
        User.objects.create_user(username="username2", password="password2")
        ProxyUser.objects.create_user_with(
            user_id=2,
            nickname="닉네임2",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구2",
            dong="동2",
            gender="여성",
            introduction="안녕하세요 user2입니다.",
            preferred_exercises=[{"exerciseName": "축구", "skillLevel": "상"}],
        )

        test_post1 = Post.objects.create(
            exercise=test_exercise,
            host=test_user1,
            title="post1 title",
            description="post1 description",
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
        Participation.objects.create(user=test_user1, post=test_post1)
        Notification.objects.create(
            user=test_user1, post=test_post1, noti_type="comment")

    def test_signup(self):
        client = Client()

        # 201 test (request successfully)
        response = client.post(
            "/users/signup", self.new_user3, content_type="application/json"
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
            self.new_user5,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)

        # 200 test (request successfully)
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
        response = client.get("/users/get/1")
        self.assertEqual(response.status_code, 401)

        # 405 test
        response = client.put("/users/1", data=None)
        self.assertEqual(response.status_code, 405)

        # POST test
        # 201 test
        User.objects.create_user(username="username3", password="password3")
        response = client.post(
            "/users/3", self.new_user3_profile, content_type="application/json")
        self.assertEqual(response.status_code, 201)

        User.objects.create_user(username="username4", password="password4")
        response = client.post(
            "/users/4", self.new_user4_profile, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        response = client.post(
            "/users/4", self.new_user5_profile, content_type="application/json")
        self.assertEqual(response.status_code, 400)

        # after signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # 200 test (get)
        response = client.get("/users/get/1")
        self.assertEqual(response.status_code, 200)

        # 200 test (patch)
        response = client.patch(
            "/users/1", self.new_user4_profile, content_type="application/json")
        self.assertEqual(response.status_code, 200)

    def test_notification(self):
        client = Client()

        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )
        response = client.get("/users/1/notification")
        self.assertEqual(response.status_code, 201)

        response = client.get("/users/notification/1")
        self.assertEqual(response.status_code, 200)
