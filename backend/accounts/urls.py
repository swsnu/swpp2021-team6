from django.urls import path
from accounts import views


urlpatterns = [
    path("signup", views.signup, name="signup"),
    path("signin", views.signin, name="signin"),
    path("signout", views.signout, name="signout"),
    path("<int:user_id>", views.user_detail, name="user_detail"),
    path("<int:user_id>/notification", views.get_notification, name="get_notification"),
    path("<int:user_id>/notification/<int:post_id>/<str:noti_type>", views.create_notification, name="create_notification"),
    path("notification/<int:noti_id>", views.read_notification, name="read_notification"),
]