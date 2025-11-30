import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
    const [isTestMode, setIsTestMode] = useState(false); // New state for test mode
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [userId, setUserId] = useState(parseInt(localStorage.getItem('userId')));
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (token && userRole && userId) {
            // Optionally validate token here
            navigate('/dashboard');
        } else if (location.pathname === '/dashboard') {
            // If no token, and trying to access dashboard, redirect to home
            navigate('/');
        }
        // Otherwise, allow navigation to /login or /register if no token
    }, [token, userRole, userId, navigate, location.pathname]);

    const handleSetAuthData = (newToken, newRole, newUserId) => {
        setToken(newToken);
        setUserRole(newRole);
        setUserId(newUserId);
        if (newToken) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    };

    const toggleTestMode = () => {
        setIsTestMode(!isTestMode);
        console.log(`Test mode is now: ${!isTestMode}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        setToken(null);
        setUserRole(null);
        setUserId(null);
        navigate('/');
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<HomePage isTestMode={isTestMode} toggleTestMode={toggleTestMode} />} />
                <Route path="/login" element={<AuthPage setAuthData={handleSetAuthData} isTestMode={isTestMode} />} />
                <Route path="/register" element={<AuthPage setAuthData={handleSetAuthData} isTestMode={isTestMode} />} />
                <Route
                    path="/dashboard"
                    element={
                        token ? (
                            <DashboardPage
                                token={token}
                                userRole={userRole}
                                userId={userId}
                                handleLogout={handleLogout}
                                isTestMode={isTestMode} // Pass isTestMode to DashboardPage
                            />
                        ) : (
                            <HomePage />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
