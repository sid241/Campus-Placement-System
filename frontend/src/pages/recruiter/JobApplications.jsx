import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

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
                                        <Card.Title>Applicant ID: {app.student} {isRecommended && <Badge bg="success" className="ms-2">AI Match</Badge>}</Card.Title>
                                        <Badge bg={app.status === 'applied' ? 'warning' : app.status === 'rejected' ? 'danger' : 'success'}>
                                            {app.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <Card.Text><strong>Applied on:</strong> {new Date(app.applied_on).toLocaleDateString()}</Card.Text>
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
                            <Card.Body py-2>
                                <strong>{student.first_name} {student.last_name}</strong> - {student.major}
                                <p className="mb-0 small text-muted mt-1"><strong>Skills:</strong> {student.skills}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
