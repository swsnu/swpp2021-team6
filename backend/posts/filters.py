from django.db.models.query_utils import Q
from .models import Exercise, Level


class PostFilter:
    def __init__(self, querydict, queryset):
        self.querydict = querydict
        self.queryset = queryset

    @property
    def qs(self):
        exercise_name_labels = self.querydict.getlist("exercise")
        level_labels = self.querydict.getlist("level")

        # /posts
        # []
        if not exercise_name_labels and not level_labels:
            return self.queryset

        # /posts?exercise=&level=
        # [""]
        if (
            len(exercise_name_labels) == 1
            and exercise_name_labels[0] == ""
            and len(level_labels) == 1
            and level_labels[0] == ""
        ):
            return self.queryset

        exercise_names = [
            Exercise.Name.label_to_value(label) for label in exercise_name_labels
        ]
        levels = [Level.label_to_value(label) for label in level_labels]

        # WHERE exercise exercise.name = '...' AND post.expected_level = '...'
        # OR exercise exercise.name = '...' AND post.expected_level = '...'
        # OR ...
        q = Q()
        for e, l in zip(exercise_names, levels):
            q |= Q(exercise__name=e, expected_level=l)

        # SELECT *
        # FROM post
        # INNER JOIN exercise
        # ON post.exercise_id = exercise.id
        # WHERE ...
        return self.queryset.filter(q)
