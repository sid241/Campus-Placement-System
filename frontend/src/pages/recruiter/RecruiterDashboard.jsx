import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api';

const RecruiterDashboard = () => {
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const compRes = await api.get('recruiter/profile/');
                setCompany(compRes.data);
                const jobsRes = await api.get('recruiter/jobs/');
                setJobs(jobsRes.data);
            } catch (err) {
                console.error("Error fetching recruiter data", err);
            }
        };
        fetchData();
    }, []);

    if (!company) return <div>Loading...</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Recruiter Dashboard: {company.name}</h2>
                <Button as={Link} to="/recruiter/post-job" variant="success">Post New Job</Button>
            </div>
            <hr/>
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <Card.Title>Company Profile</Card.Title>
                    <p><strong>Description:</strong> {company.description}</p>
                    <p><strong>Location:</strong> {company.location}</p>
                    {company.website && <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></p>}
                </Card.Body>
            </Card>

            <h4>Your Posted Jobs</h4>
            {jobs.length === 0 && <p>No jobs posted yet.</p>}
            
            {jobs.map(job => (
                <Card key={job.id} className="mb-3 shadow-sm border-0">
                    <Card.Body>
                        <Card.Title>{job.title} {job.is_active ? <Badge bg="success" className="ms-2 mb-1">Active</Badge> : <Badge bg="secondary" className="ms-2 mb-1">Inactive</Badge>}</Card.Title>
                        <Card.Text><strong>Required Skills:</strong> {job.required_skills}</Card.Text>
                        <Card.Text><strong>Posted on:</strong> {new Date(job.posted_on).toLocaleDateString()}</Card.Text>
                        <Button as={Link} to={`/recruiter/jobs/${job.id}/applications`} variant="primary">View Applications & AI Matches</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default RecruiterDashboard;
