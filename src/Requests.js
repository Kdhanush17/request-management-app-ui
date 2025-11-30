import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Requests.css';

const Requests = ({ token, userRole, userId, employees, isTestMode }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeFilter, setActiveFilter] = useState('all');

    const API_URL = 'http://localhost:5000/api/requests';

    const config = {
        headers: {
            'x-auth-token': token,
        },
    };

    // Mock data for test mode
    const [mockRequests, setMockRequests] = useState([
        {
            id: 1,
            title: 'Test Request 1 (Pending)',
            description: 'This is a mock request pending approval.',
            created_by_username: 'testemployee',
            assigned_to_username: 'testmanager',
            assigned_to: 2, // Assuming testmanager has id 2
            status: 'pending_approval',
            manager_approved: false,
            created_at: new Date().toISOString(),
        },
        {
            id: 2,
            title: 'Test Request 2 (Approved)',
            description: 'This is a mock request that has been approved.',
            created_by_username: 'testemployee',
            assigned_to_username: 'testemployee',
            assigned_to: 1, // Assuming testemployee has id 1
            status: 'approved',
            manager_approved: true,
            created_at: new Date().toISOString(),
        },
        {
            id: 3,
            title: 'Test Request 3 (Actioned)',
            description: 'This is a mock request that has been actioned.',
            created_by_username: 'testemployee',
            assigned_to_username: 'testemployee',
            assigned_to: 1, // Assuming testemployee has id 1
            status: 'actioned',
            manager_approved: true,
            created_at: new Date().toISOString(),
        },
        {
            id: 4,
            title: 'Test Request 4 (Closed)',
            description: 'This is a mock request that has been closed.',
            created_by_username: 'testemployee',
            assigned_to_username: 'testemployee',
            assigned_to: 1, // Assuming testemployee has id 1
            status: 'closed',
            manager_approved: true,
            created_at: new Date().toISOString(),
        },
        {
            id: 5,
            title: 'Test Request 5 (Rejected)',
            description: 'This is a mock request that has been rejected.',
            created_by_username: 'testemployee',
            assigned_to_username: 'testmanager',
            assigned_to: 2, // Assuming testmanager has id 2
            status: 'rejected',
            manager_approved: false,
            created_at: new Date().toISOString(),
        },
    ]);

    useEffect(() => {
        if (isTestMode) {
            setRequests(mockRequests);
            setMessage({ type: 'info', text: 'Using mock request data in test mode.' });
        } else if (token) {
            fetchRequests();
        }
    }, [token, isTestMode, mockRequests]); // Added mockRequests to dependency array

    const fetchRequests = async () => {
        if (isTestMode) {
            setRequests(mockRequests);
            setMessage({ type: 'info', text: 'Using mock request data in test mode.' });
            return;
        }
        try {
            const res = await axios.get(API_URL, config);
            setRequests(res.data);
        } catch (err) {
            setMessage({ type: 'error', text: err.response.data.message || 'Failed to fetch requests' });
        }
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (isTestMode) {
            const newRequestId = Math.max(...mockRequests.map(r => r.id)) + 1;
            const assignedEmployee = employees.find(emp => emp.id === parseInt(assignedTo));
            const newMockRequest = {
                id: newRequestId,
                title,
                description,
                created_by_username: userRole === 'employee' ? 'testemployee' : 'testmanager', // Placeholder for current user
                assigned_to_username: assignedEmployee ? assignedEmployee.username : 'Unknown',
                assigned_to: parseInt(assignedTo),
                status: 'pending_approval',
                manager_approved: false,
                created_at: new Date().toISOString(),
            };
            setMockRequests(prev => [...prev, newMockRequest]);
            setMessage({ type: 'success', text: 'Test request created successfully!' });
            setTitle('');
            setDescription('');
            setAssignedTo('');
            // No need to fetchRequests, as mockRequests state is directly updated
        } else {
            try {
                const res = await axios.post(API_URL, { title, description, assigned_to: parseInt(assignedTo) }, config);
                setMessage({ type: 'success', text: 'Request created successfully!' });
                setTitle('');
                setDescription('');
                setAssignedTo('');
                fetchRequests();
            } catch (err) {
                setMessage({ type: 'error', text: err.response.data.message || 'Failed to create request' });
            }
        }
    };

    const handleApproveReject = async (requestId, status) => {
        if (isTestMode) {
            setMockRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status, manager_approved: status === 'approved' } : req
            ));
            setMessage({ type: 'success', text: `Test request ${status} successfully!` });
        } else {
            try {
                const res = await axios.put(`${API_URL}/${requestId}/approve`, { status }, config);
                setMessage({ type: 'success', text: `Request ${status} successfully!` });
                fetchRequests();
            } catch (err) {
                setMessage({ type: 'error', text: err.response.data.message || `Failed to ${status} request` });
            }
        }
    };

    const handleActionRequest = async (requestId) => {
        if (isTestMode) {
            setMockRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: 'actioned' } : req
            ));
            setMessage({ type: 'success', text: 'Test request actioned successfully!' });
        } else {
            try {
                const res = await axios.put(`${API_URL}/${requestId}/action`, {}, config);
                setMessage({ type: 'success', text: 'Request actioned successfully!' });
                fetchRequests();
            } catch (err) {
                setMessage({ type: 'error', text: err.response.data.message || 'Failed to action request' });
            }
        }
    };

    const handleCloseRequest = async (requestId) => {
        if (isTestMode) {
            setMockRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: 'closed' } : req
            ));
            setMessage({ type: 'success', text: 'Test request closed successfully!' });
        } else {
            try {
                const res = await axios.put(`${API_URL}/${requestId}/close`, {}, config);
                setMessage({ type: 'success', text: 'Request closed successfully!' });
                fetchRequests();
            } catch (err) {
                setMessage({ type: 'error', text: err.response.data.message || 'Failed to close request' });
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending_approval: { class: 'status-pending', label: 'Pending Approval' },
            approved: { class: 'status-approved', label: 'Approved' },
            rejected: { class: 'status-rejected', label: 'Rejected' },
            actioned: { class: 'status-actioned', label: 'Actioned' },
            closed: { class: 'status-closed', label: 'Closed' }
        };
        const config = statusConfig[status] || { class: 'status-default', label: status };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    const filteredRequests = requests.filter(request => {
        if (activeFilter === 'all') return true;
        return request.status === activeFilter;
    });

    return (
        <div className="requests-container">
            {/* Header Section */}
            <div className="requests-header-section">
                <div className="requests-title-section">
                    <h2 className="requests-main-title">Request Management</h2>
                    <p className="requests-subtitle">Manage and track all your requests in one place</p>
                </div>
                
                {/* Filter Tabs - Clearly positioned below the title */}
                <div className="filter-section">
                    <h3 className="filter-title">Filter by Status:</h3>
                    <div className="filter-tabs-container">
                        {[
                            { key: 'all', label: 'All Requests' },
                            { key: 'pending_approval', label: 'Pending Approval' },
                            { key: 'approved', label: 'Approved' },
                            { key: 'actioned', label: 'Actioned' },
                            { key: 'closed', label: 'Closed' },
                            { key: 'rejected', label: 'Rejected' }
                        ].map(filter => (
                            <button
                                key={filter.key}
                                className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter.key)}
                            >
                                <span className="filter-label">{filter.label}</span>
                                <span className="filter-count">
                                    ({filter.key === 'all' ? requests.length : 
                                      requests.filter(r => r.status === filter.key).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Request Form */}
            {userRole === 'employee' && (
                <div className="create-request-section">
                    <div className="create-request-card">
                        <div className="create-request-header">
                            <h3>Create New Request</h3>
                            <div className="create-request-indicator">
                                <div className="indicator-dot"></div>
                                <span>New Request</span>
                            </div>
                        </div>
                        <form onSubmit={handleCreateRequest} className="request-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Request Title</label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="e.g., Laptop Issue Fix" 
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Assign To</label>
                                    <select 
                                        value={assignedTo} 
                                        onChange={(e) => setAssignedTo(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Team Member</option>
                                        {employees.map((emp) => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.username} (ID: {emp.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Request Description</label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    placeholder="Describe your request in detail... Example: Unable to work with my laptop showing blue screen error since morning."
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="create-button">
                                <span className="button-icon">+</span>
                                Create Request
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Messages */}
            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    <span className="alert-icon">
                        {message.type === 'success' ? '✓' : message.type === 'error' ? '⚠' : 'ℹ'}
                    </span>
                    {message.text}
                </div>
            )}

            {/* Requests Grid */}
            <div className="requests-content-section">
                <div className="requests-stats">
                    <div className="stat-item">
                        <span className="stat-number">{filteredRequests.length}</span>
                        <span className="stat-label">
                            {activeFilter === 'all' ? 'Total Requests' : 
                             activeFilter.replace('_', ' ') + ' Requests'}
                        </span>
                    </div>
                </div>

                <div className="requests-grid">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="request-card">
                                <div className="request-card-header">
                                    <div className="request-title-section">
                                        <h4 className="request-title">{request.title}</h4>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    <div className="request-id">#{request.id}</div>
                                </div>
                                
                                <p className="request-description">{request.description}</p>
                                
                                <div className="request-meta-grid">
                                    <div className="meta-item">
                                        <span className="meta-icon">👤</span>
                                        <div className="meta-content">
                                            <span className="meta-label">Created By</span>
                                            <span className="meta-value">{request.created_by_username}</span>
                                        </div>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-icon">🎯</span>
                                        <div className="meta-content">
                                            <span className="meta-label">Assigned To</span>
                                            <span className="meta-value">{request.assigned_to_username}</span>
                                        </div>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-icon">✅</span>
                                        <div className="meta-content">
                                            <span className="meta-label">Manager Approved</span>
                                            <span className={`meta-value ${request.manager_approved ? 'approved' : 'pending'}`}>
                                                {request.manager_approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="request-actions">
                                    {userRole === 'manager' && request.status === 'pending_approval' && (
                                        <div className="action-buttons">
                                            <button 
                                                onClick={() => handleApproveReject(request.id, 'approved')}
                                                className="btn-approve"
                                            >
                                                <span className="btn-icon">✓</span>
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleApproveReject(request.id, 'rejected')}
                                                className="btn-reject"
                                            >
                                                <span className="btn-icon">✗</span>
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {userRole === 'employee' && request.assigned_to === userId && request.status === 'approved' && (
                                        <button 
                                            onClick={() => handleActionRequest(request.id)}
                                            className="btn-action"
                                        >
                                            <span className="btn-icon">⚡</span>
                                            Mark as Actioned
                                        </button>
                                    )}

                                    {userRole === 'employee' && request.assigned_to === userId && request.status === 'actioned' && (
                                        <button 
                                            onClick={() => handleCloseRequest(request.id)}
                                            className="btn-close"
                                        >
                                            <span className="btn-icon">🔒</span>
                                            Close Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-requests-state">
                            <div className="no-requests-icon">📋</div>
                            <h3>No requests found</h3>
                            <p>No requests match the current filter criteria.</p>
                            {activeFilter !== 'all' && (
                                <button 
                                    className="clear-filter-btn"
                                    onClick={() => setActiveFilter('all')}
                                >
                                    Show All Requests
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requests;
