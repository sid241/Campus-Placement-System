from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import RegisterStudentSerializer, RegisterRecruiterSerializer, UserSerializer

User = get_user_model()

class RegisterStudentView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterStudentSerializer

class RegisterRecruiterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterRecruiterSerializer

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import StudentProfile, Job, Application, Company, Placement
from .serializers import StudentProfileSerializer, JobSerializer, ApplicationSerializer, CompanySerializer

class StudentProfileDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = StudentProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user.student_profile

    def perform_update(self, serializer):
        print(f"DEBUG: PATCH request from user: {self.request.user}")
        print(f"DEBUG: Headers: {self.request.headers.get('Authorization', 'MISSING')}")
        instance = serializer.save()
        if 'resume' in self.request.FILES and instance.resume:
            import os
            from ml_engine.resume_parser import parse_resume
            if os.path.exists(instance.resume.path):
                parsed_data = parse_resume(instance.resume.path)
                skills_list = parsed_data.get('skills', [])
                if skills_list:
                    instance.skills = ", ".join(skills_list)
                    instance.save()

class AvailableJobsListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = JobSerializer
    queryset = Job.objects.filter(is_active=True)

class ApplyJobView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ApplicationSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student_profile)

class StudentApplicationsListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.filter(student=self.request.user.student_profile)

class CompanyProfileDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CompanySerializer

    def get_object(self):
        return self.request.user.company_profile

class RecruiterJobListView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(company=self.request.user.company_profile)

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company_profile)

class RecruiterJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(company=self.request.user.company_profile)

class JobApplicationsListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(job_id=job_id, job__company=self.request.user.company_profile)

class UpdateApplicationStatusView(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        return Application.objects.filter(job__company=self.request.user.company_profile)

class AdminDashboardView(generics.GenericAPIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, *args, **kwargs):
        total_students = StudentProfile.objects.count()
        total_companies = Company.objects.count()
        total_jobs = Job.objects.count()
        total_applications = Application.objects.count()
        total_placements = Placement.objects.count()

        return Response({
            'total_students': total_students,
            'total_companies': total_companies,
            'total_jobs': total_jobs,
            'total_applications': total_applications,
            'total_placements': total_placements,
        })

class StudentRecommendedJobsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        from ml_engine.recommender import get_job_recommendations_for_student
        student_id = request.user.student_profile.id
        recommendations = get_job_recommendations_for_student(student_id)
        job_ids = [r['job_id'] for r in recommendations]
        jobs = Job.objects.filter(id__in=job_ids)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

class RecruiterJobRecommendationsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, job_id, *args, **kwargs):
        from ml_engine.recommender import get_student_recommendations_for_job
        try:
            job = Job.objects.get(id=job_id, company=request.user.company_profile)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
            
        recommendations = get_student_recommendations_for_job(job.id)
        student_ids = [r['student_id'] for r in recommendations]
        students = StudentProfile.objects.filter(id__in=student_ids)
        serializer = StudentProfileSerializer(students, many=True)
        return Response(serializer.data)
