from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    def __str__(self):
        return f"{self.username} ({self.role})"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    degree = models.CharField(max_length=100, blank=True, default='')
    major = models.CharField(max_length=100)
    graduation_year = models.IntegerField(null=True, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    skills = models.TextField(blank=True, help_text="Comma-separated skills extracted from resume")
    experience = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.major})"

class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return self.name

class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=255)
    description = models.TextField()
    required_skills = models.TextField(help_text="Comma-separated required skills")
    experience_needed = models.CharField(max_length=100, default="Fresher")
    salary_package = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255)
    posted_on = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

class Application(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
    )
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='applied')
    applied_on = models.DateTimeField(auto_now_add=True)
    cover_letter = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student.user.username} - {self.job.title}"

class Placement(models.Model):
    student = models.OneToOneField(StudentProfile, on_delete=models.CASCADE, related_name='placement')
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    package_offered = models.CharField(max_length=100)
    placed_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.user.username} placed at {self.job.company.name}"
