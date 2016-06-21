from django.conf import settings
from django.conf.urls.static import static

from django.conf.urls import include, url
from django.contrib import admin
admin.autodiscover()

import hello.views

urlpatterns = [
    url(r'^$', hello.views.index, name='index'),
    url(r'^db', hello.views.db, name='db'),
    url(r'^videos/', include('videos.urls')),
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^video/', include('video.urls')),
]

if settings.DEBUG:
    urlpatterns.append(url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}))

#if settings.DEBUG:
    # static files (images, css, javascript, etc.)
 #   urlpatterns += patterns('',
  #      (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
   #     'document_root': settings.MEDIA_ROOT}))
