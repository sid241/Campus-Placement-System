from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from core.models import StudentProfile, Job

def get_job_recommendations_for_student(student_profile_id: int):
    """
    Given a student_id, find the most similar jobs using cosine similarity
    on extracted skills and job required_skills.
    """
    try:
        student = StudentProfile.objects.get(id=student_profile_id)
    except StudentProfile.DoesNotExist:
        return []

    student_skills_text = student.skills
    if not student_skills_text:
        return []

    jobs = Job.objects.filter(is_active=True)
    if not jobs.exists():
        return []

    job_docs = []
    job_ids = []
    for job in jobs:
        job_docs.append(job.required_skills)
        job_ids.append(job.id)

    # Add student skills as the last doc
    documents = job_docs + [student_skills_text]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Compute cosine similarity between student (last row) and all jobs
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()

    # Get sorted job indices based on similarity score (descending)
    recommended_indices = cosine_sim.argsort()[::-1]

    recommendations = []
    for idx in recommended_indices:
        score = cosine_sim[idx]
        if score > 0.05: # threshold
            job_id = job_ids[idx]
            recommendations.append({
                "job_id": job_id,
                "score": round(score, 2)
            })

    return recommendations

def get_student_recommendations_for_job(job_id: int):
    """
    Given a job_id, find the best matching students using cosine similarity.
    """
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return []

    job_requirements_text = job.required_skills
    if not job_requirements_text:
        return []

    students = StudentProfile.objects.exclude(skills="")
    if not students.exists():
        return []

    student_docs = []
    student_ids = []
    for student in students:
        student_docs.append(student.skills)
        student_ids.append(student.id)

    documents = student_docs + [job_requirements_text]

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
    recommended_indices = cosine_sim.argsort()[::-1]

    recommendations = []
    for idx in recommended_indices:
        score = cosine_sim[idx]
        if score > 0.05:
            student_id = student_ids[idx]
            recommendations.append({
                "student_id": student_id,
                "score": round(score, 2)
            })

    return recommendations
