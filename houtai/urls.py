from django.conf.urls import url

urlpatterns = [
    url(r'^login/$','houtai.views.login'),
    url(r'^index/','houtai.views.index'),
    url(r'^$', 'houtai.views.index'),
    url(r'^post/$','houtai.views.post'),
    url(r'^delete/$','houtai.views.delete'),
    url(r'^option/$','houtai.views.option'),
]
