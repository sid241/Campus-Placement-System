import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import api from '../../api';

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('student/jobs/');
                setJobs(res.data);
            } catch (err) { }
            
            try {
                const recRes = await api.get('student/jobs/recommended/');
                setRecommendedJobs(recRes.data);
            } catch (err) { }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        try {
            await api.post('student/jobs/apply/', { job: jobId });
            alert("Applied successfully!");
        } catch (err) {
            alert("Error applying. You might have already applied.");
        }
    };

    const recommendedJobIds = recommendedJobs.map(j => j.id);

    return (
        <div>
            <h2>Available Jobs</h2>
            <hr/>
            {jobs.map(job => {
                const isRecommended = recommendedJobIds.includes(job.id);
                return (
                    <Card key={job.id} className="mb-3 shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>
                                {job.title} at {job.company_name} 
                                {isRecommended && <Badge bg="success" className="ms-3 mb-1">Recommended Match</Badge>}
                            </Card.Title>
                            <Card.Text><strong>Description:</strong> {job.description}</Card.Text>
                            <Card.Text><strong>Required Skills:</strong> {job.required_skills}</Card.Text>
                            <Button variant="primary" onClick={() => handleApply(job.id)}>Apply for Job</Button>
                        </Card.Body>
                    </Card>
                );
            })}
            
            {jobs.length === 0 && <p>No active jobs available at this time.</p>}
        </div>
    );
};

export default AvailableJobs;
