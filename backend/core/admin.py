from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, StudentProfile, Company, Job, Application, Placement

admin.site.register(User, UserAdmin)
admin.site.register(StudentProfile)
admin.site.register(Company)
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(Placement)
