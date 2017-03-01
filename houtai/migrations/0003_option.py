# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0002_msg_img'),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('permission', models.BooleanField(default=True, verbose_name='\u662f\u5426\u5141\u8bb8\u964c\u751f\u4eba\u89c2\u770b')),
                ('name_male', models.CharField(max_length=20, verbose_name='\u7537\u65b9\u7528\u6237\u540d')),
                ('name_female', models.CharField(max_length=20, verbose_name='\u5973\u65b9\u7528\u6237\u540d')),
                ('avatar_male', models.CharField(max_length=50, verbose_name='\u7537\u65b9\u5934\u50cf')),
                ('avatar_female', models.CharField(max_length=50, verbose_name='\u5973\u65b9\u5934\u50cf')),
            ],
        ),
    ]
