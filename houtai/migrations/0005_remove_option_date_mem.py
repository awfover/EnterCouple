# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0004_option_date_mem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='option',
            name='date_mem',
        ),
    ]
