from enum import Enum


class PostSort:
    def __init__(self, querydict, queryset):
        self.querydict = querydict
        self.queryset = queryset

    @property
    def qs(self):
        # "sort" 키의 값들 중 PostSortOption에 정의된 값들만 추출
        sort_opts = [
            value
            for value in self.querydict.getlist("sort")
            if value in PostSortOption.get_all_values()
        ]

        # 추출된 값이 없으면 모임 날짜 빠른 순 정렬
        if not sort_opts:
            return self.queryset.order_by(PostSortOption.MEET_AT_ASC.value)

        # 추출된 값들이 있으면 그 값들로 정렬
        return self.queryset.order_by(*sort_opts)


class PostSortOption(Enum):
    # name = value
    MEET_AT_ASC = "meet_at"
    MEET_AT_DESC = "-meet_at"

    @classmethod
    def get_all_values(cls):
        return [opt.value for opt in cls]
