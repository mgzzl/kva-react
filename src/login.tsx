// src/login.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import App from './App';
import { setCookie, getCookie } from './utils/cookies';
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorModal from './components/ErrorModal';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const savedUsername = getCookie('username');
        if (savedUsername) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add your login logic here
        if (username === 'kg-kva' && password === 'KVA-Generator!') {
            setIsLoggedIn(true);
            setCookie('username', username, 1);  // Cookie expires in 1 day
        } else {
            setErrorMessage('Please provide a valid username and password');
            setShowError(true);
            console.log("Please provide a valid username and password");
        }
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    if (isLoggedIn) {
        return <Router>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </Router>
    }

    return (
        <div className="container">
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                    <h1 className="text-center">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} message={errorMessage} />
        </div>
    );
}

export default Login;
