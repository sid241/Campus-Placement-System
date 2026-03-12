import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import api, { BACKEND_URL } from '../../api';

const JobApplications = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobRes = await api.get(`recruiter/jobs/${id}/`);
                setJob(jobRes.data);

                const appRes = await api.get(`recruiter/jobs/${id}/applications/`);
                setApplications(appRes.data);

                const recRes = await api.get(`recruiter/jobs/${id}/recommendations/`);
                setRecommendations(recRes.data);
            } catch (err) {
                console.error("Error fetching job applications", err);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            await api.patch(`recruiter/applications/${appId}/status/`, { status: newStatus });
            setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (!job) return <div>Loading...</div>;

    const recommendedStudentIds = recommendations.map(r => r.id);

    return (
        <div>
            <h2>Applications for: {job.title}</h2>
            <Link to="/recruiter/dashboard" className="btn btn-secondary mb-3">Back to Dashboard</Link>
            <hr/>
            <div className="row">
                <div className="col-md-7">
                    <h4>Applicants</h4>
                    {applications.length === 0 && <p>No applications yet.</p>}
                    {applications.map(app => {
                        const isRecommended = recommendedStudentIds.includes(app.student);
                        return (
                            <Card key={app.id} className="mb-3 shadow-sm border-0">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>
                                            {app.student_details ? `${app.student_details.first_name} ${app.student_details.last_name}` : `Applicant ID: ${app.student}`}
                                            {isRecommended && <Badge bg="success" className="ms-2">AI Match</Badge>}
                                        </Card.Title>
                                        <Badge bg={app.status === 'applied' ? 'warning' : app.status === 'rejected' ? 'danger' : 'success'}>
                                            {app.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <Card.Text><strong>Applied on:</strong> {new Date(app.applied_on).toLocaleDateString()}</Card.Text>
                                    {app.student_details && (
                                        <div className="mb-2">
                                            <p className="mb-1 small"><strong>Major:</strong> {app.student_details.major} | <strong>GPA:</strong> {app.student_details.gpa || 'N/A'}</p>
                                            <p className="mb-2 small"><strong>Skills:</strong> {app.student_details.skills || 'N/A'}</p>
                                            {app.student_details.resume && (
                                                <a 
                                                    href={app.student_details.resume.startsWith('http') ? app.student_details.resume : `${BACKEND_URL}${app.student_details.resume}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-info"
                                                >
                                                    View Resume
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    <Card.Text><strong>Cover Letter:</strong> {app.cover_letter || 'None provided'}</Card.Text>
                                    <Form.Select 
                                        size="sm" 
                                        className="w-50 mt-2" 
                                        value={app.status}
                                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="interview_scheduled">Interview Scheduled</option>
                                        <option value="selected">Selected</option>
                                        <option value="rejected">Rejected</option>
                                    </Form.Select>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
                <div className="col-md-5">
                    <h4>Top Recommended Students</h4>
                    <p className="text-muted small">Based on NLP analysis of their resume vs your job requirements.</p>
                    {recommendations.length === 0 && <p>No exact matches found yet.</p>}
                    {recommendations.map(student => (
                        <Card key={student.id} className="mb-2 shadow-sm border-success">
                            <Card.Body className="py-2">
                                <strong>{student.first_name} {student.last_name}</strong> - {student.major}
                                <p className="mb-1 small text-muted mt-1"><strong>Skills:</strong> {student.skills}</p>
                                {student.resume && (
                                    <a 
                                        href={student.resume.startsWith('http') ? student.resume : `${BACKEND_URL}${student.resume}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="btn btn-sm btn-link p-0 text-decoration-none"
                                    >
                                        View Resume
                                    </a>
                                )}
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
