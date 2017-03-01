# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='msg',
            name='img',
            field=models.TextField(default='sad', max_length=999999, verbose_name='\u4e0a\u4f20\u56fe\u7247'),
            preserve_default=False,
        ),
    ]
