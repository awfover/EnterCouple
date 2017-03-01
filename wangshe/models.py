# -*- coding: utf-8 -*-
from django.db import models
import django.utils.timezone as timezone
import datetime
import string

# Create your models here.
class Msg(models.Model):
    content = models.TextField(u'前端代码存储')
    date = models.DateTimeField(u'发表时间')
    author = models.CharField(u'作者',max_length=20)
    img = models.TextField(u'上传图片',max_length=999999)
    msg_type = models.CharField(u'消息类型',max_length=10)
    read_or_not = models.BooleanField(u'是否已读',default=False)
    comment_id = models.CharField(u'评论对应ID值',max_length=5,blank = True,null = True)

    def __unicode__(self):
        return self.author

    # 对Msg中的内容按时间进行排序
    class Meta:
        ordering = ['-date']

class Option(models.Model):
    permission = models.BooleanField(u'是否允许陌生人观看', default = True)
    name_male = models.CharField(u'男方用户名', max_length = 20)
    name_female = models.CharField(u'女方用户名', max_length = 20)
    avatar_male = models.CharField(u'男方头像', max_length = 50)
    avatar_female = models.CharField(u'女方头像', max_length = 50)
    date_mem = models.DateTimeField(u'纪念日', default = datetime.datetime(2014, 5, 20))
    name_mem = models.CharField(u'纪念日内容', default = '纪念日', max_length = 50)
    theme_male = models.CharField(u'用户使用模板', default = 'default', max_length = 50)
    theme_female = models.CharField(u'用户使用模板', default = 'default', max_length = 50)

    # 陌生人权限处理
    def rePermission(self):
        self.permission = not self.permission
        self.save()

    # 用户名更改处理
    def setUsername(self, old, new):
        if self.name_male.lower() == old.lower():
            self.name_male = new
        elif self.name_female.lower() == old.lower():
            self.name_female = new
        self.save()

    # 头像更换处理
    def avatar(self, name):
        if self.name_male.lower() == name.lower():
            return self.avatar_male
        elif self.name_female.lower() == name.lower():
            return self.avatar_female

    def setAvatar(self, name, new):
        if self.name_male.lower() == name.lower():
            self.avatar_male = new
        elif self.name_female.lower() == name.lower():
            self.avatar_female = new
        self.save()

    # 纪念日倒数,以及周年数计算
    def calc_memory(self):
        mem = self.date_mem.replace(tzinfo = None)
        now = timezone.now().replace(tzinfo = None)
        year = now.year - mem.year
        mem = mem.replace(year = now.year)
        if mem < now:
            year += 1
            mem = mem.replace(year = (now.year + 1))
        day = (mem - now).days
        return [maps(year), str(day)]

    # 设置纪念日日期
    def setMemoryName(self, new):
        self.name_mem = new
        self.save()

    def setMemoryDate(self, new):
        day = new.split('-')
        if len(day) != 3:
            return ''

        now = datetime.datetime.now().replace(tzinfo = None)
        try:
            date = datetime.datetime(string.atoi(day[0]), string.atoi(day[1]), string.atoi(day[2])).replace(tzinfo = None)
        except:
            return ''
        if date > now:
            return ''

        self.date_mem = date
        self.save()
        return '\n'.join(self.calc_memory())

    # 更换网页模板
    def setTheme(self, user, new):
        if user.lower() == self.name_male.lower():
            self.theme_male = new
        elif user.lower() == self.name_female.lower():
            self.theme_female = new
        self.save()


# 周年数处理
def maps(x):
    key = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    if x <= 10:
        return key[x]
    return (key[x / 10] + key[10] + key[x % 10])