import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import api, { BACKEND_URL } from '../../api';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('student/profile/');
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;
        
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        try {
            const res = await api.patch('student/profile/', formData);
            setProfile(res.data);
            setMessage("Resume uploaded and parsed successfully!");
        } catch (err) {
            const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : (err.message || "Error uploading resume.");
            setMessage("Upload Failed: " + errorMsg);
        }
    };

    if (!profile) return <div>Loading Profile...</div>;

    return (
        <div>
            <h2>Student Dashboard</h2>
            {message && <Alert variant="info">{message}</Alert>}
            
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <Card.Title>Profile Information</Card.Title>
                    <hr/>
                    <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                    <p><strong>Major:</strong> {profile.major}</p>
                    <p><strong>GPA:</strong> {profile.gpa || 'N/A'}</p>
                    <p><strong>Extracted Skills:</strong> {profile.skills || 'None'}</p>
                    {profile.resume && (
                        <p><a href={profile.resume.startsWith('http') ? profile.resume : `${BACKEND_URL}${profile.resume}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">View Current Resume</a></p>
                    )}
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Card.Title>Upload New Resume</Card.Title>
                    <hr/>
                    <Form onSubmit={handleUpload}>
                        <Form.Group className="mb-3">
                            <Form.Label>Resume (PDF)</Form.Label>
                            <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
                            <Form.Text className="text-muted">
                                Uploading a new resume will automatically update your skills via our NLP engine.
                            </Form.Text>
                        </Form.Group>
                        <Button type="submit" variant="primary">Upload Resume</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentDashboard;
