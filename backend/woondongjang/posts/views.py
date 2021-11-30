from json.decoder import JSONDecodeError
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST, require_http_methods
import json

from .models import Post, Comment, Post_Keyword, Participation
from .filters import PostFilter
from accounts.decorators import signin_required


@require_http_methods(["GET", "POST"])
@signin_required
def posts(request):
    # Retrieve all posts
    if request.method == "GET":
        post_list = [
            {
                "post_id": post.id,
                "host_id": post.host.id,
                "exercise_name": post.exercise.name,
                "expected_level": post.expected_level,
                "title": post.title,
                "description": post.description,
                "meet_at": post.meet_at_res,
                "place": {
                    "latitude": post.latitude,
                    "longitude": post.longitude,
                    "gu": post.gu,
                    "dong": post.dong,
                    "name": post.place_name,
                    "address": post.place_address,
                    "telephone": post.place_telephone,
                },
                "min_capacity": post.min_capacity,
                "max_capacity": post.max_capacity,
                "member_count": post.member_count,
                "kakaotalk_link": post.kakaotalk_link,
                "status": post.status,
                "keywords": [
                    get_object_or_404(Post_Keyword, post=post).keyword1,
                    get_object_or_404(Post_Keyword, post=post).keyword2,
                    get_object_or_404(Post_Keyword, post=post).keyword3,
                ],
            }
            for post in PostFilter(request.GET, Post.objects.all()).qs
        ]

        return JsonResponse(post_list, safe=False, status=200)
    # Create a new post
    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            exercise_name = req_data["exercise_name"]
            title = req_data["title"]
            description = req_data["description"]
            expected_level = req_data["expected_level"]
            meet_at = req_data["meet_at"]
            latitude = req_data["place"]["latitude"]
            longitude = req_data["place"]["longitude"]
            gu = req_data["place"]["gu"]
            dong = req_data["place"]["dong"]
            place_name = req_data["place"]["name"]
            place_address = req_data["place"]["address"]
            place_telephone = req_data["place"]["telephone"]
            min_capacity = req_data["min_capacity"]
            max_capacity = req_data["max_capacity"]
            kakaotalk_link = req_data["kakaotalk_link"]
        except (KeyError, JSONDecodeError):
            return HttpResponse(status=400)

        new_post = Post.objects.create_post(
            request.user,
            exercise_name,
            title,
            description,
            expected_level,
            meet_at,
            latitude,
            longitude,
            gu,
            dong,
            place_name,
            place_address,
            place_telephone,
            min_capacity,
            max_capacity,
            kakaotalk_link,
        )

        post_keyword = get_object_or_404(Post_Keyword, post=new_post)
        keyword_list = [
            post_keyword.keyword1,
            post_keyword.keyword2,
            post_keyword.keyword3,
        ]

        response_dict = {
            "post_id": new_post.id,
            "host_id": new_post.host.id,
            "exercise_name": new_post.exercise.name,
            "title": new_post.title,
            "description": new_post.description,
            "expected_level": new_post.expected_level,
            "meet_at": new_post.meet_at_res,
            "place": {
                "latitude": new_post.latitude,
                "longitude": new_post.longitude,
                "gu": new_post.gu,
                "dong": new_post.dong,
                "name": new_post.place_name,
                "address": new_post.place_address,
                "telephone": new_post.place_telephone,
            },
            "max_capacity": new_post.max_capacity,
            "min_capacity": new_post.min_capacity,
            "member_count": new_post.member_count,
            "kakaotalk_link": new_post.kakaotalk_link,
            "status": new_post.status,
            "keywords": keyword_list,
        }

        return JsonResponse(response_dict, status=201)


@require_http_methods(["GET", "PATCH", "DELETE"])
@signin_required
def post_detail(request, post_id=0):
    post = get_object_or_404(Post, id=post_id)

    # Retrieve a specified post
    if request.method == "GET":
        post_keyword = get_object_or_404(Post_Keyword, post_id=post.id)

        response_dict = {
            "host_id": post.host.id,
            "exercise_name": post.exercise.name,
            "title": post.title,
            "description": post.description,
            "expected_level": post.expected_level,
            "meet_at": post.meet_at_res,
            "max_capacity": post.max_capacity,
            "min_capacity": post.min_capacity,
            "member_count": post.member_count,
            "place": {
                "latitude": post.latitude,
                "longitude": post.longitude,
                "gu": post.gu,
                "dong": post.dong,
                "name": post.place_name,
                "address": post.place_address,
                "telephone": post.place_telephone,
            },
            "kakaotalk_link": post.kakaotalk_link,
            "status": post.status,
            "keywords": [
                post_keyword.keyword1,
                post_keyword.keyword2,
                post_keyword.keyword3,
            ],
        }

        return JsonResponse(response_dict, status=200)
    # Update a specified post
    elif request.method == "PATCH":
        # 권한 확인
        if request.user.id != post.host.id:
            return HttpResponse(status=403)

        try:
            req_data = json.loads(request.body.decode())
            title = req_data["title"]
            description = req_data["description"]
        except (KeyError, JSONDecodeError):
            return HttpResponse(status=400)

        post.title = title
        post.description = description
        post.save()

        response_dict = {
            "post_id": post.id,
            "host_id": post.host.id,
            "title": post.title,
            "description": post.description,
        }

        return JsonResponse(response_dict, status=200)
    # Delete a specified psot
    elif request.method == "DELETE":
        # 권한 확인
        if request.user.id != post.host.id:
            return HttpResponse(status=403)

        post.delete()

        return HttpResponse(status=200)


@require_http_methods(["GET", "POST"])
@signin_required
def comments(request, post_id=0):
    post = get_object_or_404(Post, id=post_id)

    # Retrieve all comments of a specified post
    if request.method == "GET":
        comment_list = [
            {
                "author_id": comment.author.id,
                "post_id": comment.post.id,
                "content": comment.content,
            }
            for comment in Comment.objects.filter(post_id=post_id)
        ]
        return JsonResponse(comment_list, safe=False, status=200)
    # Create a new comment on a specified post
    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            content = req_data["content"]
        except (KeyError, JSONDecodeError):
            return HttpResponse(status=400)

        author = request.user
        new_comment = Comment.objects.create(post=post, content=content, author=author)

        response_dict = {
            "comment_id": new_comment.id,
            "author_id": new_comment.author.id,
            "post_id": new_comment.post.id,
            "content": new_comment.content,
        }

        return JsonResponse(response_dict, status=201)


@require_http_methods(["GET", "PATCH", "DELETE"])
@signin_required
def comment_detail(request, comment_id=0):
    comment = get_object_or_404(Comment, id=comment_id)

    # Retrieve a specified comment
    if request.method == "GET":
        response_dict = {
            "author_id": comment.author.id,
            "post_id": comment.post.id,
            "content": comment.content,
        }

        return JsonResponse(response_dict, status=200)
    # Update a specified comment
    elif request.method == "PATCH":
        # 권한 확인
        if request.user.id != comment.author.id:
            return HttpResponse(status=403)

        try:
            req_data = json.loads(request.body.decode())
            content = req_data["content"]
        except (KeyError, JSONDecodeError):
            return HttpResponse(status=400)

        comment.content = content
        comment.save()

        response_dict = {
            "comment_id": comment.id,
            "author_id": comment.author.id,
            "post_id": comment.post.id,
            "content": comment.content,
        }

        return JsonResponse(response_dict, status=200)
    # Delete a specified comment
    elif request.method == "DELETE":
        # 권한 확인
        if request.user.id != comment.author.id:
            return HttpResponse(status=403)

        comment.delete()

        return HttpResponse(status=200)


@require_POST
@signin_required
def apply(request, post_id):
    # Post 조회
    post = get_object_or_404(Post, id=post_id)

    # 권한 확인
    if request.user.id == post.host.id:
        return HttpResponse(status=403)

    # Participation 생성
    Participation.objects.create(user=request.user, post=post)

    return HttpResponse(status=204)


@require_POST
@signin_required
def accept(request, post_id, participant_id):
    # Post 조회
    post = get_object_or_404(Post, id=post_id)

    # User(participant) 조회
    participant = get_object_or_404(User, id=participant_id)

    # Participation 상태 변경
    Participation.objects.filter(user=participant, post=post).update(
        status=Participation.Status.ACCEPTED
    )

    return HttpResponse(status=204)


@require_POST
@signin_required
def decline(request, post_id, participant_id):
    # Post 조회
    post = get_object_or_404(Post, id=post_id)

    # User(participant) 조회
    participant = get_object_or_404(User, id=participant_id)

    # Participation 상태 변경
    Participation.objects.filter(user=participant, post=post).update(
        status=Participation.Status.DECLINED
    )

    return HttpResponse(status=204)
