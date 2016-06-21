from django.conf.urls import url
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^videos/$', views.videos, name='videos'),
    url(r'^vrview/', views.vrview, name='vrview'),
]