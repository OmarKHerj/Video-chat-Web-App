# Generated by Django 4.2.4 on 2023-11-08 13:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Base', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='RoomUser',
        ),
    ]