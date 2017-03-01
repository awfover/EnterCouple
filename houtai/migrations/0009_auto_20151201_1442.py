# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0008_option_name_mem'),
    ]

    operations = [
        migrations.AddField(
            model_name='msg',
            name='comment_id',
            field=models.CharField(max_length=5, null=True, verbose_name='\u8bc4\u8bba\u5bf9\u5e94ID\u503c', blank=True),
        ),
        migrations.AlterField(
            model_name='msg',
            name='date',
            field=models.DateTimeField(verbose_name='\u53d1\u8868\u65f6\u95f4'),
        ),
    ]
