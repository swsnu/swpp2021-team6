from .models import Exercise


class PostFilter:
    def __init__(self, querydict, queryset):
        self.querydict = querydict
        self.queryset = queryset

    @property
    def qs(self):
        exercise_name_labels = self.querydict.getlist("exercise")

        if not exercise_name_labels or exercise_name_labels[0] == "":
            return self.queryset

        exercise_names = [
            Exercise.Name.label_to_value(label) for label in exercise_name_labels
        ]

        return self.queryset.filter(exercise__name__in=exercise_names).all()
