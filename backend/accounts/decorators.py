from django.http import HttpResponse


def signin_required(func):
    def decorator(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        return func(request, *args, **kwargs)

    return decorator
