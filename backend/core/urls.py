from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterStudentView, RegisterRecruiterView, UserProfileView,
    StudentProfileDetailView, AvailableJobsListView, ApplyJobView, StudentApplicationsListView,
    CompanyProfileDetailView, RecruiterJobListView, RecruiterJobDetailView, JobApplicationsListView, UpdateApplicationStatusView,
    AdminDashboardView, StudentRecommendedJobsView, RecruiterJobRecommendationsView
)

urlpatterns = [
    path('auth/register/student/', RegisterStudentView.as_view(), name='register_student'),
    path('auth/register/recruiter/', RegisterRecruiterView.as_view(), name='register_recruiter'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),

    path('student/profile/', StudentProfileDetailView.as_view(), name='student_profile'),
    path('student/jobs/', AvailableJobsListView.as_view(), name='available_jobs'),
    path('student/jobs/recommended/', StudentRecommendedJobsView.as_view(), name='student_recommended_jobs'),
    path('student/jobs/apply/', ApplyJobView.as_view(), name='apply_job'),
    path('student/applications/', StudentApplicationsListView.as_view(), name='student_applications'),

    path('recruiter/profile/', CompanyProfileDetailView.as_view(), name='company_profile'),
    path('recruiter/jobs/', RecruiterJobListView.as_view(), name='recruiter_jobs'),
    path('recruiter/jobs/<int:pk>/', RecruiterJobDetailView.as_view(), name='recruiter_job_detail'),
    path('recruiter/jobs/<int:job_id>/recommendations/', RecruiterJobRecommendationsView.as_view(), name='job_recommendations_recruiter'),
    path('recruiter/jobs/<int:job_id>/applications/', JobApplicationsListView.as_view(), name='job_applications'),
    path('recruiter/applications/<int:pk>/status/', UpdateApplicationStatusView.as_view(), name='update_application_status'),
    
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
