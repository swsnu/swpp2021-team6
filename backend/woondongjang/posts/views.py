from django.contrib.auth.models import User
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    JsonResponse,
)
from .models import Post, Exercise, Comment, Post_Keyword, Participation
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import transaction
from .ml.ibmCloud import keyword_extraction_ML


@csrf_exempt
@transaction.atomic
def posts(request):
    # GET : 모든 post의 list 반환
    if request.method == "GET":
        # 만약에 로그인이 되어 있지 않은 user면 401
        if not request.user.is_authenticated:
            return HttpResponse(status=401)

        else:
            # 일단, place를 보내주는걸로!!
            post_list = [
                {
                    "title": post.title,
                    "meet_at": post.meet_at,
                    "host": post.host.id,
                    "capacity": post.capacity,
                    "keyword1": Post_Keyword.objects.get(post_id=post.id).keyword1,
                    "keyword2": Post_Keyword.objects.get(post_id=post.id).keyword2,
                    "keyword3": Post_Keyword.objects.get(post_id=post.id).keyword3,
                    "member_count": post.member_count,
                    "status": post.status,
                    "place": post.place,
                    "exercise": post.exercise.name,
                }
                for post in Post.objects.all()
            ]
            return JsonResponse(post_list, safe=False, status=200)

    # POST : 새로운 post 생성
    elif request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        else:
            req_data = json.loads(request.body.decode())
            host = request.user
            exercise_name = req_data["exercise_name"]
            title = req_data["title"]
            description = req_data["description"]
            meet_at = req_data["meet_at"]
            place = req_data["place"]
            latitude = req_data["latitude"]
            longitude = req_data["longitude"]
            gu = req_data["gu"]
            dong = req_data["dong"]
            capacity = req_data["capacity"]
            kakaotalk_link = req_data["kakaotalk_link"]

            # machine learning code 아직 모델에 안넣었음.
            keyword_list = keyword_extraction_ML(description)

            new_exercise = Exercise.objects.get(name=exercise_name)

            new_post = Post(
                exercise=new_exercise,
                host=host,
                title=title,
                description=description,
                meet_at=meet_at,
                place=place,
                latitude=latitude,
                longitude=longitude,
                gu=gu,
                dong=dong,
                capacity=capacity,
                kakaotalk_link=kakaotalk_link,
            )
            new_post.save()

            new_post_keyword = Post_Keyword(
                post=new_post,
                keyword1=keyword_list[0],
                keyword2=keyword_list[1],
                keyword3=keyword_list[2],
            )
            new_post_keyword.save()

            response_dict = {
                "post_id": new_post.id,
                "host_id": new_post.host.id,
                "title": new_post.title,
                "description": new_post.description,
                "meet_at": new_post.meet_at,
                "place": new_post.place,
                "latitude": new_post.latitude,
                "longitude": new_post.longitude,
                "gu": new_post.gu,
                "dong": new_post.dong,
                "capacity": new_post.capacity,
                "kakaotalk_link": new_post.kakaotalk_link,
            }
            return JsonResponse(response_dict, status=201)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
def post_detail(request, post_id=0):
    # GET : 특정 id의 post의 정보를 반환
    if request.method == "GET":
        if request.user.is_authenticated:
            # 만약 특정 id의 Post가 없으면 404.
            if not Post.objects.filter(id=post_id).exists():
                return HttpResponse(status=404)
            # 있으면 Json Response
            else:
                post = Post.objects.get(id=post_id)
                post_keyword = Post_Keyword.objects.get(post_id=post.id)
                response_dict = {
                    "host_id": post.host.id,
                    "exercise": post.exercise.name,
                    "title": post.title,
                    "description": post.description,
                    "keyword1": post_keyword.keyword1,
                    "keyword2": post_keyword.keyword2,
                    "keyword3": post_keyword.keyword3,
                    "meet_at": post.meet_at,
                    "place": post.place,
                    "latitude": post.latitude,
                    "longitude": post.longitude,
                    "gu": post.gu,
                    "dong": post.dong,
                    "capacity": post.capacity,
                    "member_count": post.member_count,
                    "status": post.status,
                    "kakaotalk_link": post.kakaotalk_link,
                }
                return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

        # Edit specified article
    elif request.method == "PATCH":
        if request.user.is_authenticated:
            # 만약 특정 id의 article이 있으면
            if Post.objects.filter(id=post_id).exists():
                post = Post.objects.get(id=post_id)

                # user가 edit할 권한이 있으면
                if request.user.id == post.host.id:
                    req_data = json.loads(request.body.decode())
                    title = req_data["title"]
                    description = req_data["description"]

                    post.title = title
                    post.description = description
                    post.save()
                    response_dict = {
                        "id": post.id,
                        "host_id": post.host.id,
                        "title": post.title,
                        "description": post.description,
                    }
                    return JsonResponse(response_dict, status=200)

                else:
                    return HttpResponse(status=403)
            # 없으면 404
            else:
                return HttpResponse(status=404)
        # 로그인이 안되어 있으면 401
        else:
            return HttpResponse(status=401)

    # Delete specified article
    elif request.method == "DELETE":
        if request.user.is_authenticated:
            # 만약아 해당 article이 있고
            if Post.objects.filter(id=post_id).exists():
                post = Post.objects.get(id=post_id)
                # user가 delete할 권한이 있으면
                if request.user.id == post.host.id:
                    post.delete()
                    return HttpResponse(status=200)
                # 권한이 없으면 403
                else:
                    return HttpResponse(status=403)
            # 해당 article이 없으면 404
            else:
                return HttpResponse(status=404)
        # 로그인이 되어 있지 않은 user면 401
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["GET", "PATCH", "DELETE"])


@csrf_exempt
def comments(request, post_id=0):
    # Get comments of specified article
    if request.method == "GET":
        if request.user.is_authenticated:
            if Post.objects.filter(id=post_id).exists():
                comment_list = [
                    {
                        "post_id": comment.post.id,
                        "content": comment.content,
                        "author_id": comment.author.id,
                    }
                    for comment in Comment.objects.filter(post_id=post_id)
                ]
                return JsonResponse(comment_list, safe=False, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    # Create comment on specified article
    elif request.method == "POST":
        if request.user.is_authenticated:
            # 특정 article이 있을 때
            if Post.objects.filter(id=post_id).exists():
                req_data = json.loads(request.body.decode())
                comment_post = Post.objects.get(id=post_id)
                comment_content = req_data["content"]
                comment_author = request.user
                new_comment = Comment(
                    post=comment_post, content=comment_content, author=comment_author
                )
                new_comment.save()

                response_dict = {
                    "id": new_comment.id,
                    "post_id": new_comment.post.id,
                    "content": new_comment.content,
                    "author_id": new_comment.author.id,
                }
                return JsonResponse(response_dict, status=201)
            # 특정 article이 없을 때
            else:
                return HttpResponse(status=404)
        # 로그인하지 않은 user일 때
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@csrf_exempt
def comment_detail(request, comment_id=0):
    # Get specified comment
    if request.method == "GET":
        if request.user.is_authenticated:
            if Comment.objects.filter(id=comment_id).exists():
                comment = Comment.objects.get(id=comment_id)
                response_dict = {
                    "post_id": comment.post.id,
                    "content": comment.content,
                    "author_id": comment.author.id,
                }
                return JsonResponse(response_dict, status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    # Edit specified comment
    elif request.method == "PATCH":
        if request.user.is_authenticated:
            if Comment.objects.filter(id=comment_id).exists():
                comment = Comment.objects.get(id=comment_id)
                if request.user.id == comment.author.id:
                    req_data = json.loads(request.body.decode())
                    comment.content = req_data["content"]
                    comment.save()
                    response_dict = {
                        "id": comment.id,
                        "post": comment.post.id,
                        "content": comment.content,
                        "author": comment.author.id,
                    }
                    return JsonResponse(response_dict, status=200)
                else:
                    return HttpResponse(status=403)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    # Delete specified comment
    elif request.method == "DELETE":
        # 로그인이 되어 있고
        if request.user.is_authenticated:
            # 해당 comment id의 comment가 있고
            if Comment.objects.filter(id=comment_id).exists():
                comment = Comment.objects.get(id=comment_id)
                # 로그인된 user가 delete 권한이 있을 때
                if request.user.id == comment.author.id:
                    comment.delete()
                    return HttpResponse(status=200)
                else:
                    return HttpResponse(status=403)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(["GET", "PATCH", "DELETE"])


@csrf_exempt
def apply(request, post_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    # Post 조회
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "POST":
        Participation.objects.create(user=request.user, post=post)
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["POST"])


@csrf_exempt
def accept(request, post_id, participant_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    # Post 조회
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return HttpResponse(status=404)

    # User(participant) 조회
    try:
        participant = User.objects.get(id=participant_id)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "POST":
        Participation.objects.filter(user=participant, post=post).update(
            status=Participation.Status.ACCEPTED
        )
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["POST"])


@csrf_exempt
def decline(request, post_id, participant_id):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    # Post 조회
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return HttpResponse(status=404)

    # User(participant) 조회
    try:
        participant = User.objects.get(id=participant_id)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "POST":
        Participation.objects.filter(user=participant, post=post).update(
            status=Participation.Status.DECLINED
        )
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["POST"])
