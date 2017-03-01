# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0007_remove_msg_src'),
    ]

    operations = [
        migrations.AddField(
            model_name='option',
            name='name_mem',
            field=models.CharField(default=b'\xe7\xba\xaa\xe5\xbf\xb5\xe6\x97\xa5', max_length=50, verbose_name='\u7eaa\u5ff5\u65e5\u5185\u5bb9'),
        ),
    ]
