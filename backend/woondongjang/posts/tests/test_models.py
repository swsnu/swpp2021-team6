from django.contrib.auth.models import User
from django.test import TestCase

from ..models import Exercise, Post


class PostsModelsTestCase(TestCase):
    def test_create_post(self):
        # Given
        host = User.objects.create_user(username="username")
        Exercise.objects.create(name="축구")

        # When
        post = Post.objects.create_post(
            host=host,
            exercise_name="축구",
            title="이번 주말에 축구 한판 하실 분 구해요",
            description="안녕하세요~ 이번 주말에 잠실에서 축구 함께 하실 분 구하고 있습니다! 저희가 다 활발한 편이어서 MBTI E에 해당하는 분들이 오시면 좋을 것 같아요! 뒷풀이도 예정하고 있으니 많은 참여 부탁드립니다!",
            expected_level="중",
            meet_at="2021-11-11 11:11",
            latitude=37.51500918875395,
            longitude=127.07310699230715,
            gu="송파구",
            dong="잠실동",
            place_name="잠실종합운동장",
            place_address="서울시 송파구 올림픽로 25",
            place_telephone="02-2240-8800",
            min_capacity=3,
            max_capacity=10,
            kakaotalk_link="https://open.kakao.com/o/test",
        )

        # Then
        self.assertEqual(post.id, 1)
        self.assertEqual(post.exercise.name, "축구")
