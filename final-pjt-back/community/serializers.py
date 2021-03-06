from rest_framework import serializers
from .models import Review, Comment
from django.contrib.auth import get_user_model
from movies.serializers import MovieSummarySerializer

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ('pk', 'username', 'nickname')
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ('pk', 'user', 'content', 'review', 'created_at', 'updated_at')
        read_only_fields = ('review', )


class ReviewSerializer(serializers.ModelSerializer):

    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ('pk', 'username', 'nickname')

    comments = CommentSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    like_users = UserSerializer(read_only=True, many=True)
    movie = MovieSummarySerializer(read_only=True)
    class Meta:
        model = Review
        fields = ('pk', 'user', 'rate', 'movie', 'title', 'content', 'comments', 'like_users', 'created_at', 'updated_at')
