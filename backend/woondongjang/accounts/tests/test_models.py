from django.test import TestCase

from ..models import ProxyUser
from posts.models import Exercise, User_Exercise


class AccountsTestCase(TestCase):
    def test_create_user_with(self):
        # Given
        Exercise.objects.create(name="축구")

        # When
        user = ProxyUser.objects.create_user_with(
            username="username1",
            password="password1",
            nickname="닉네임1",
            latitude=37.47880163846696,
            longitude=126.94494429645442,
            gu="구1",
            dong="동1",
            gender="남성",
            introduction="안녕하세요 user1입니다.",
            preferred_exercises=[{"exercise_name": "축구", "skill_level": "중"}],
        )

        # Then
        self.assertEqual(user.id, 1)
        self.assertEqual(user.username, "username1")

        profile = user.profile
        self.assertEqual(profile.id, 1)
        self.assertEqual(profile.nickname, "닉네임1")
        self.assertEqual(profile.latitude, 37.47880163846696)
        self.assertEqual(profile.longitude, 126.94494429645442)
        self.assertEqual(profile.gu, "구1")
        self.assertEqual(profile.dong, "동1")
        self.assertEqual(profile.gender, "남성")
        self.assertEqual(profile.introduction, "안녕하세요 user1입니다.")

        user_exercise = User_Exercise.objects.filter(user=user).first()
        self.assertEqual(user_exercise.exercise.name, "축구")
        self.assertEqual(user_exercise.skill_level, "중")
