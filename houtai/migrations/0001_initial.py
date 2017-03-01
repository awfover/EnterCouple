# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Msg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField(verbose_name='\u524d\u7aef\u4ee3\u7801\u5b58\u50a8')),
                ('date', models.DateTimeField(auto_now_add=True, verbose_name='\u53d1\u8868\u65f6\u95f4')),
                ('author', models.CharField(max_length=20, verbose_name='\u4f5c\u8005')),
                ('src', models.CharField(max_length=50, verbose_name='\u5934\u50cf\u94fe\u63a5')),
                ('msg_type', models.CharField(max_length=10, verbose_name='\u6d88\u606f\u7c7b\u578b')),
                ('read_or_not', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5df2\u8bfb')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
    ]
