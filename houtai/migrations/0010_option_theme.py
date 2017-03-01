# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0009_auto_20151201_1442'),
    ]

    operations = [
        migrations.AddField(
            model_name='option',
            name='theme',
            field=models.CharField(default=b'default', max_length=50, verbose_name='\u7528\u6237\u4f7f\u7528\u6a21\u677f'),
        ),
    ]
