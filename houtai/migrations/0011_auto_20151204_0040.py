# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0010_option_theme'),
    ]

    operations = [
        migrations.RenameField(
            model_name='option',
            old_name='theme',
            new_name='theme_female',
        ),
        migrations.AddField(
            model_name='option',
            name='theme_male',
            field=models.CharField(default=b'default', max_length=50, verbose_name='\u7528\u6237\u4f7f\u7528\u6a21\u677f'),
        ),
    ]
