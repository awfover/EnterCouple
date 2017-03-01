# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houtai', '0006_option_date_mem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='msg',
            name='src',
        ),
    ]
