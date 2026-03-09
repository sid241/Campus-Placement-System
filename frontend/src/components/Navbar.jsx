import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Smart Placement</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {user && user.role === 'student' && (
                            <>
                                <Nav.Link as={Link} to="/student/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/student/jobs">Jobs</Nav.Link>
                            </>
                        )}
                        {user && user.role === 'recruiter' && (
                            <>
                                <Nav.Link as={Link} to="/recruiter/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} to="/recruiter/post-job">Post Job</Nav.Link>
                            </>
                        )}
                        {user && user.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Navbar.Text className="me-3">
                                    Signed in as: {user.username} ({user.role})
                                </Navbar.Text>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
