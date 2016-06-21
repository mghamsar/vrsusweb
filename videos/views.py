from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse


def index(request):
    fullpath = request.META['HTTP_HOST']
    return render(request, 'videos.html',{'fullpath': fullpath})


def videos(request): #,name):
	return HttpResponse("Hello, world. You're at the videos videos index.")


def vrview(request):
	fullpath = request.META['HTTP_HOST']
	return render(request, 'vrview.html',{'fullpath': fullpath})