import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', 
        first_name: '', last_name: '', major: '', // Student
        company_name: '' // Recruiter
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'student') {
                await api.post('auth/register/student/', formData);
            } else {
                await api.post('auth/register/recruiter/', formData);
            }
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setMessage('Error registering. Username may be taken or data invalid.');
        }
    };

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-8">
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <Card.Title className="text-center mb-4 fs-3">Register</Card.Title>
                        {message && <Alert variant={message.includes('successful') ? 'success' : 'danger'}>{message}</Alert>}
                        <div className="mb-4 text-center">
                            <Form.Check inline type="radio" label="Student" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                            <Form.Check inline type="radio" label="Recruiter" name="role" value="recruiter" checked={role === 'recruiter'} onChange={() => setRole('recruiter')} />
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <div className="row">
                                <Form.Group className="col-md-6 mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control name="username" required onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="col-md-6 mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" required onChange={handleChange} />
                                </Form.Group>
                                <Form.Group className="col-md-12 mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" name="email" required onChange={handleChange} />
                                </Form.Group>
                                
                                {role === 'student' && (
                                    <>
                                        <Form.Group className="col-md-6 mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control name="first_name" required onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="col-md-6 mb-3">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control name="last_name" required onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="col-md-12 mb-3">
                                            <Form.Label>Major / Degree Stream</Form.Label>
                                            <Form.Control name="major" required onChange={handleChange} placeholder="e.g. Computer Science"/>
                                        </Form.Group>
                                    </>
                                )}
                                
                                {role === 'recruiter' && (
                                    <Form.Group className="col-md-12 mb-3">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control name="company_name" required onChange={handleChange} placeholder="e.g. Google, Apple"/>
                                    </Form.Group>
                                )}
                            </div>
                            <Button type="submit" variant="success" className="w-100 mt-2">Complete Registration</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Register;
