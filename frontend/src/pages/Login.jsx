import React, { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({...credentials, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials.username, credentials.password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5">
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <Card.Title className="text-center mb-4 fs-3">Login</Card.Title>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control name="username" required onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" required onChange={handleChange} />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100">Login</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Login;
