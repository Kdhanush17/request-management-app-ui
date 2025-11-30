import React from 'react';
import Auth from '../Auth';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = ({ setAuthData, isTestMode }) => {
    const navigate = useNavigate();

    const handleSuccessfulAuth = (newToken, newUserRole, newUserId) => {
        setAuthData(newToken, newUserRole, newUserId);
        navigate('/dashboard');
    };

    return (
        <div className="auth-page-container">
            <div className="auth-background">
                <div className="auth-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </div>
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">RequestFlow</h1>
                        <p className="auth-subtitle">Streamline your workflow management</p>
                        {isTestMode && <p className="test-mode-indicator" style={{color: 'red'}}>TEST MODE ACTIVE</p>}
                    </div>
                    <Auth setAuthData={handleSuccessfulAuth} isTestMode={isTestMode} />
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
