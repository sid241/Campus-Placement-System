import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import api from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('admin/dashboard/');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load admin stats", err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading Analytics...</div>;

    return (
        <div>
            <h2>Admin Placement Analytics</h2>
            <hr/>
            <Row>
                <Col md={4} className="mb-3">
                    <Card className="text-white bg-primary shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Total Students</Card.Title>
                            <h3>{stats.total_students}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-white bg-success shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Total Companies</Card.Title>
                            <h3>{stats.total_companies}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="text-white bg-info shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Total Jobs</Card.Title>
                            <h3>{stats.total_jobs}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="text-white bg-warning shadow-sm border-0 text-dark">
                        <Card.Body>
                            <Card.Title>Total Applications Received</Card.Title>
                            <h3>{stats.total_applications}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-3">
                    <Card className="text-white bg-danger shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Total Placements</Card.Title>
                            <h3>{stats.total_placements}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
