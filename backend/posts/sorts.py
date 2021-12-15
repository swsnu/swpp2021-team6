from enum import Enum
from haversine import haversine


class PostSort:
    def __init__(self, profile, querydict, queryset):
        self.querydict = querydict
        self.queryset = queryset
        self.profile = profile

    @property
    def qs(self):
        # "sort" 키의 값들 중 PostSortOption에 정의된 값들만 추출
        # /posts?sort=meet_at,foo
        # [meet_at]
        sort_opts = [
            value
            for value in self.querydict.getlist("sort")
            if value in PostSortOption.get_all_values()
        ]
        
        scope_filter = [value[0] for value in self.querydict.getlist("scope")]
        
        if not sort_opts:
            sort_opts.append("meet_at")
        if not scope_filter:
            scope_filter.append("5")
        
        
        query_dist_arr = []
        user_location = (self.profile.latitude, self.profile.longitude)
        for each_query in self.queryset:
            query_location = [each_query.latitude, each_query.longitude]
            query_dist_arr.append((each_query, haversine(user_location, query_location, unit = 'km')))

        filtered_query_arr = [each for each in query_dist_arr if each[1] <= int(scope_filter[0])]
        
        # 추출된 값이 없으면 모임 날짜 빠른 순 정렬
        # if not sort_opts:
        #     return self.queryset.order_by(PostSortOption.MEET_AT_ASC.value)

        if "meet_at" in sort_opts:
            filtered_query_set = [each[0] for each in filtered_query_arr]
            return sorted(filtered_query_set, key=lambda item: item.meet_at)
        elif "dist" in sort_opts:
            # 거리순으로 정렬해서 돌려줌
            filtered_query_arr = sorted(filtered_query_arr, key=lambda item: item[1])
        # 추출된 값들이 있으면 그 값들로 정렬
            return [each[0] for each in filtered_query_arr]


class PostSortOption(Enum):
    # name = value
    MEET_AT_ASC = "meet_at"
    MEET_AT_DESC = "-meet_at"
    DISTANCE_DESC = "dist"

    @classmethod
    def get_all_values(cls):
        return [opt.value for opt in cls]
