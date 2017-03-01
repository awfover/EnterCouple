# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0005_remove_option_date_mem'),
    ]

    operations = [
        migrations.AddField(
            model_name='option',
            name='date_mem',
            field=models.DateTimeField(default=datetime.datetime(2014, 5, 20, 0, 0), verbose_name='\u7eaa\u5ff5\u65e5'),
        ),
    ]
