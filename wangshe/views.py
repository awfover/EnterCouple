# -*- coding:utf-8 -*-

import os
import random
import datetime

from django.shortcuts import render, render_to_response
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import auth

from houtai.models import Msg, Option

# 登陆处理函数
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponse('')
        else:
            return HttpResponse('用户名或密码有误，请重试。')
    return render_to_response('html/login.html',{})

# 主页显示以及将数据库内容导入的主页的相关处理
def index(request):
    options = Option.objects.all()[0]
    msgs = Msg.objects.all()
    for i in msgs:
        i.delete()
    user_avatar = ''
    if request.user.is_authenticated():
        user_avatar = options.avatar(request.user.username)
        # if request.user.username.lower() == 'sophia':
        #     user_avatar = '../static/img/avatar_sophia.png'
        # else:
        #     user_avatar = '../static/img/avatar_maple.png'
    elif not options.permission:
            return render_to_response('html/login.html',{})
    return render(request, 'html/index.html', locals())

# 文件上传后存储的相关函数
def getAvailPath(dir_local, dir_relative , name):
    path = dir_relative + name;
    while os.path.exists(dir_local + path):
        path = dir_relative + str(hash(''.join(random.sample('qwertyuioplkjhgfdsazxcvbnm1234567890', 10)))) + name
    return path;


def fileSave(f):
    path = getAvailPath(os.path.dirname(__file__).replace('\\', '/') + '/', '../static/img/', f.name)
    dest = open(os.path.dirname(__file__).replace('\\', '/') + '/' + path, 'wb+')
    for chunk in f.chunks():
        dest.write(chunk)
    dest.close()
    return path

# 处理日志，留言，图片上传，评论的相关函数
def post(request):
    if request.method == 'POST':
        content = request.POST['content']
        author = request.POST['author']
        msg_type = request.POST['type']
        time = request.POST['time']
        msg_time = datetime.datetime.strptime(time, "%Y-%m-%d %H:%M;%S")
        img = ''
        options = Option.objects.all()[0]
        user_avatar = ''
        if request.user.is_authenticated():
            user_avatar = options.avatar(request.user.username)
        if msg_type.encode('utf-8') == 'photo':
            filelist = request.FILES.getlist('photo')
            for i in filelist:
                img += ';' + fileSave(i)
            msg = Msg(content=content, author=author, img = img, msg_type=msg_type, date = msg_time)
            msg.save()
        elif msg_type.encode('utf-8') == 'comment':
            id_ = request.POST['sid']
            msg = Msg(content=content, author=author, img = img, msg_type=msg_type, date = msg_time, comment_id = id_)
            msg.save()
            options = Option.objects.all()[0]
            item = msg
            return render(request, 'html/comment_piece.html', locals())
        else:
            msg = Msg(content=content, author=author, img = img, msg_type=msg_type, date = msg_time)
            msg.save()
        item = msg
        return render(request, 'html/timeaxis_item.html', locals())


# 实现删除功能的函数
def delete(request):
    if request.method == 'POST':
        opt = request.POST['option']
        sid = request.POST['sid']
        if opt == 'remove':
            msg = Msg.objects.get(id = sid);
            if msg.msg_type == 'comment':
                msg.delete()
            else:
                for i in Msg.objects.filter(comment_id = msg.id):
                    i.delete()
                msg.delete()
        return HttpResponse('')

# 各种项的相关处理
def option(request):
    if request.method == 'POST':
        options = Option.objects.all()[0]
        opt = request.POST['option']
        if opt == 'permission':
            options.rePermission()
        elif opt == 'logout':
            auth.logout(request)
            return HttpResponseRedirect('/login/')
        elif opt == 'username':
            old = request.POST['old']
            new = request.POST['new']
            options.setUsername(old, new)
        elif opt == 'avatar':
            user = request.POST['username']
            avatar = request.FILES['avatar']
            options.setAvatar(user, fileSave(avatar))
        elif opt == 'name_mem':
            options.setMemoryName(request.POST['new'])
        elif opt == 'date_mem':
            return HttpResponse(options.setMemoryDate(request.POST['new']))
        elif opt == 'theme':
            username = request.POST['username']
            new = request.POST['new']
            options.setTheme(username, new)
        return HttpResponse('option change success')

