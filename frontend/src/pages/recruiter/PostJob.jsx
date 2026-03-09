import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        required_skills: '',
        experience_needed: 'Fresher',
        salary_package: '',
        location: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('recruiter/jobs/', formData);
            setMessage('Job posted successfully!');
            setTimeout(() => navigate('/recruiter/dashboard'), 1500);
        } catch (err) {
            setMessage('Failed to post job.');
        }
    };

    return (
        <div>
            <h2>Post a New Job</h2>
            <Link to="/recruiter/dashboard" className="btn btn-secondary mb-3">Back to Dashboard</Link>
            <hr/>
            {message && <Alert variant="info">{message}</Alert>}
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control name="title" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Required Skills (comma separated)</Form.Label>
                            <Form.Control name="required_skills" required onChange={handleChange} placeholder="e.g. python, react, sql"/>
                        </Form.Group>
                        <div className="row">
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Experience Needed</Form.Label>
                                <Form.Control name="experience_needed" defaultValue="Fresher" onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Salary Package</Form.Label>
                                <Form.Control name="salary_package" onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="col-md-4 mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control name="location" required onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <Button type="submit" variant="success">Submit Job Posting</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PostJob;
