from django.urls import path
from posts import views

urlpatterns = [
    path("", views.posts, name="posts"),
    path("<int:post_id>", views.post_detail, name="post_detail"),
    path("<int:post_id>/comments", views.comments, name="comments"),
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
