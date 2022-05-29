from django.contrib import admin

# Register your models here.
from .models import Movie

class MovieAdmin(admin.ModelAdmin):
    list_display = ('pk','title', 'release_date', 'vote_average', 'overview', 'poster_path', 'backdrop_path')

# Register your models here.
admin.site.register(Movie, MovieAdmin)
