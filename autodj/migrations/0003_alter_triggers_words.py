# Generated by Django 4.0.2 on 2022-05-16 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autodj', '0002_triggertype_triggers_author_combotrigger_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='triggers',
            name='words',
            field=models.ManyToManyField(default=None, to='autodj.Words'),
        ),
    ]
