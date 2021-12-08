from django.contrib.auth.models import User
from django.test import TestCase, Client
import json
from datetime import datetime

from ..models import Participation, Post, Exercise, Post_Keyword, Comment
from accounts.models import ProxyUser


class PostsViewsTestCase(TestCase):
    new_post = json.dumps(
        {
            "exercise_name": "축구",
            "expected_level": "상",
            "title": "고수들끼리 뜨겁게 땀 한 번 흘려보아요~",
            "description": "농구한지 10년 정도 되었구요, 길거리 농구 많이 했습니다. 제가 새로운 사람들이랑 같이 땀흘리는거 좋아해서 같이 즐기실 고수님들 모집해봅니다. 제가 워낙 활발한 스타일이라 어색할 거 생각하지 마시고 편하게 참가 신청 해주세요!!!",
            "meet_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "min_capacity": 3,
            "max_capacity": 6,
            "place": {
                "name": "도림천",
                "latitude": 37.12345,
                "longitude": 127.12355,
                "gu": "관악구",
                "dong": "신림동",
                "address": "서울시 서초구 서초3동 남분순환로 323길",
                "telephone": "02-525-0854",
            },
            "kakaotalk_link": "test_kakaotalk_link_123412",
        }
    )
    new_comment = json.dumps({"content": "new comment content"})
    invalid_post = json.dumps(
        {
            "exercise_name": "축구",
            "expected_level": "상",
            "title123": "고수들끼리 뜨겁게 땀 한 번 흘려보아요~",
            "description": "농구한지 10년 정도 되었구요, 길거리 농구 많이 했습니다. 제가 새로운 사람들이랑 같이 땀흘리는거 좋아해서 같이 즐기실 고수님들 모집해봅니다. 제가 워낙 활발한 스타일이라 어색할 거 생각하지 마시고 편하게 참가 신청 해주세요!!!",
            "meet_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "min_capacity": 3,
            "max_capacity": 6,
            "place": {
                "name": "도림천",
                "latitude": 37.12345,
                "longitude": 127.12355,
                "gu": "관악구",
                "dong": "신림동",
                "address": "서울시 서초구 서초3동 남분순환로 323길",
                "telephone": "02-525-0854",
            },
            "kakaotalk_link": "test_kakaotalk_link_123412",
        }
    )
    invalid_post2 = json.dumps({
        "title" : "test_title",
    })
    invalid_comment = json.dumps({"content123": "invalid comment content"})

    def setUp(self):
        test_exercise = Exercise.objects.create(name="축구")
        User.objects.create_user(username="username1", password="password1")
        test_user1 = ProxyUser.objects.create_user_with(
            user_id=1,
            nickname="닉네임1",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구1",
            dong="동1",
            gender="MALE",
            introduction="안녕하세요 user1입니다.",
            preferred_exercises=[{"exercise_name": "축구", "skill_level": "중"}],
        )
        User.objects.create_user(username="username2", password="password2")
        test_user2 = ProxyUser.objects.create_user_with(
            user_id=2,
            nickname="닉네임2",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구2",
            dong="동2",
            gender="FEMALE",
            introduction="안녕하세요 user2입니다.",
            preferred_exercises=[{"exercise_name": "축구", "skill_level": "상"}],
        )
        test_post1 = Post.objects.create(
            exercise=test_exercise,
            host=test_user1,
            title="post1 title",
            description="post1 description",
            expected_level="상",
            meet_at=datetime.now(),
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구1",
            dong="동1",
            place_name="운동장1",
            place_address="주소1",
            place_telephone="전화번호1",
            min_capacity=10,
            max_capacity=5,
            kakaotalk_link="kakaotalk link 1",
        )
        test_post2 = Post.objects.create(
            exercise=test_exercise,
            host=test_user2,
            title="post2 title",
            description="post2 description",
            expected_level="상",
            meet_at=datetime.now(),
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
        Post_Keyword.objects.create(
            post=test_post1,
            keyword1="test_keyword1",
            keyword2="test_keyword2",
            keyword3="test_keyword3",
        )
        Post_Keyword.objects.create(
            post=test_post2,
            keyword1="test_keyword1",
            keyword2="test_keyword2",
            keyword3="test_keyword3",
        )
        Comment.objects.create(
            id=1, post=test_post1, content="comment1", author=test_user1
        )
        Comment.objects.create(
            id=2, post=test_post1, content="comment2", author=test_user2
        )

    def test_posts(self):
        client = Client()

        # DELETE -> 405
        response = client.delete("/posts/", data=None)
        self.assertEqual(response.status_code, 405)

        # GET, POST -> 401
        response = client.get("/posts/")
        self.assertEqual(response.status_code, 401)
        response = client.post("/posts/", data=None)
        self.assertEqual(response.status_code, 401)

        # Signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # GET -> 200
        response = client.get("/posts/")
        self.assertEqual(response.status_code, 200)

        # POST -> 400
        response = client.post(
            "/posts/", self.invalid_post, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        # POST -> 201
        response = client.post(
            "/posts/", self.new_post, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

    def test_post_detail(self):
        client = Client()

        # POST -> 405
        response = client.post("/posts/1", data=None)
        self.assertEqual(response.status_code, 405)

        # GET, PATCH, DELETE -> 401
        response = client.get("/posts/1")
        self.assertEqual(response.status_code, 401)
        response = client.patch("/posts/1", data=None)
        self.assertEqual(response.status_code, 401)
        response = client.delete("/posts/1", data=None)
        self.assertEqual(response.status_code, 401)

        # Signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # GET, PATCH, DELETE -> 404
        response = client.get("/posts/3")
        self.assertEqual(response.status_code, 404)
        response = client.patch(
            "/posts/3",
            data=self.new_post,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 404)
        response = client.delete("/posts/3", data=None)
        self.assertEqual(response.status_code, 404)

        # PATCH, DELETE -> 403
        response = client.patch(
            "/posts/2",
            data=self.new_post,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
        response = client.delete("/posts/2")
        self.assertEqual(response.status_code, 403)

        # GET -> 200
        response = client.get("/posts/1")
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

        # GET -> 
        response = client.get("/posts/2")
        self.assertEqual(response.status_code, 200)
        ## PATCH -> 200
        response = client.patch(
            "/posts/1", self.invalid_post, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200) 

        ## PATCH -> 200
        response = client.patch(
            "/posts/1", self.new_post, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

        ## DELETE -> 200
        response = client.delete("/posts/1")
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

    def test_comments(self):
        client = Client()

        # PATCH, DELETE -> 405
        response = client.patch("/posts/1/comments", data=None)
        self.assertEqual(response.status_code, 405)
        response = client.delete("/posts/1/comments", data=None)
        self.assertEqual(response.status_code, 405)

        # GET, POST -> 401
        response = client.get("/posts/1/comments")
        self.assertEqual(response.status_code, 401)
        response = client.post("/posts/1/comments", data=None)
        self.assertEqual(response.status_code, 401)

        # Signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # GET, POST -> 404
        response = client.get("/posts/3/comments")
        self.assertEqual(response.status_code, 404)
        response = client.post(
            "/posts/3/comments", data=self.new_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

        ## GET -> 200
        response = client.get("/posts/1/comments")
        self.assertEqual(response.status_code, 200)

        ## POST -> 201
        response = client.post(
            "/posts/1/comments", self.invalid_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)

        ## POST -> 201
        response = client.post(
            "/posts/1/comments", self.new_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

    def test_comment_detail(self):
        client = Client()

        # POST -> 405
        response = client.post("/posts/comments/1", data=None)
        self.assertEqual(response.status_code, 405)

        # GET, PATCH, DELETE -> 401
        response = client.get("/posts/comments/1")
        self.assertEqual(response.status_code, 401)
        response = client.patch("/posts/comments/1", data=None)
        self.assertEqual(response.status_code, 401)
        response = client.delete("/posts/comments/1", data=None)
        self.assertEqual(response.status_code, 401)

        # Signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # GET, PATCH, DELETE -> 404
        response = client.get("/posts/comments/3")
        self.assertEqual(response.status_code, 404)
        response = client.patch(
            "/posts/comments/3", data=self.new_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)
        response = client.delete("/posts/comments/3", data=None)
        self.assertEqual(response.status_code, 404)

        # PATCH, DELETE -> 403
        response = client.patch(
            "/posts/comments/2",
            data=self.new_comment,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
        response = client.delete("/posts/comments/2")
        self.assertEqual(response.status_code, 403)

        # GET -> 200
        response = client.get("/posts/comments/1")
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

        ## PATCH -> 400
        response = client.patch(
            "/posts/comments/1", self.invalid_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)  # Pass csrf protection

        ## PATCH -> 200
        response = client.patch(
            "/posts/comments/1", self.new_comment, content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

        ## DELETE -> 200
        response = client.delete("/posts/comments/1")
        self.assertEqual(response.status_code, 200)  # Pass csrf protection

    def test_apply(self):
        client = Client()
        # 401 test (user is None (get, post 둘다!)
        response = client.post("/posts/1/apply")
        self.assertEqual(response.status_code, 401)

        # after signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )

        # 405 test
        response = client.get("/posts/1/apply")
        self.assertEqual(response.status_code, 405)

        response = client.post("/posts/3/apply")
        self.assertEqual(response.status_code, 404)

        response = client.post("/posts/1/apply")
        self.assertEqual(response.status_code, 403)

        response = client.post("/posts/2/apply")
        self.assertEqual(response.status_code, 204)

    def test_accept(self):
        client = Client()

        # 401 test (user is None (get, post 둘다!)
        response = client.post("/posts/1/participants/1/accept")
        self.assertEqual(response.status_code, 401)

        # after signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )
        # 405 test
        response = client.get("/posts/1/participants/1/accept")
        self.assertEqual(response.status_code, 405)

        response = client.post("/posts/3/participants/1/accept")
        self.assertEqual(response.status_code, 404)

        response = client.post("/posts/1/participants/3/accept")
        self.assertEqual(response.status_code, 404)

        response = client.post("/posts/2/participants/1/accept")
        self.assertEqual(response.status_code, 204)

    def test_decline(self):
        client = Client()

        # 401 test (user is None (get, post 둘다!)
        response = client.post("/posts/1/participants/1/decline")
        self.assertEqual(response.status_code, 401)

        # after signin
        response = client.post(
            "/users/signin",
            json.dumps({"username": "username1", "password": "password1"}),
            content_type="application/json",
        )
        # 405 test
        response = client.get("/posts/1/participants/1/decline")
        self.assertEqual(response.status_code, 405)

        response = client.post("/posts/3/participants/1/decline")
        self.assertEqual(response.status_code, 404)

        response = client.post("/posts/1/participants/3/decline")
        self.assertEqual(response.status_code, 404)

        response = client.post("/posts/2/participants/1/decline")
        self.assertEqual(response.status_code, 204)
