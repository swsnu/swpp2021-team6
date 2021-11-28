from django.contrib import admin

# Register your models here.
from .models import Post, User_Exercise, Post_Keyword

admin.site.register(Post)
admin.site.register(User_Exercise)
admin.site.register(Post_Keyword)
