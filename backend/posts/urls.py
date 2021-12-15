from django.urls import path
from posts import views

urlpatterns = [
    path("get", views.get_posts, name="get_posts"),
    path("", views.post_posts, name="posts"),
    path("<int:post_id>/keywords", views.keywords, name="create_keywords"),
    path("<int:post_id>", views.post_detail, name="post_detail"),
    path("get/<int:post_id>", views.get_post_detail, name="post_detail"),
    path("get/<int:post_id>/comments", views.get_comments, name="get_comments"),
    path("<int:post_id>/comments", views.comments, name="comments"),
    path("get/comments/<int:comment_id>", views.get_comment_detail, name="get_comment_detail"),
    path("comments/<int:comment_id>", views.comment_detail, name="comment_detail"),
    path("<int:post_id>/apply", views.apply, name="apply"),
    path(
        "<int:post_id>/participants/<int:participant_id>/accept",
        views.accept,
        name="accept",
    ),
    path(
        "<int:post_id>/participants/<int:participant_id>/decline",
        views.decline,
        name="decline",
    ),
]
