// src/login.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add your login logic here
        if (username === 'kg-kva' && password === 'KVA-Generator!') {
            setIsLoggedIn(true);
            return <Navigate to="/" replace={true} />;
        } else {
            console.log("Please provide a valid username and password");
        }
    };

    return (
        <div className="container">
            {isLoggedIn ? (
                <Router>
                    <Routes>
                        <Route path="/" element={<App />} />
                    </Routes>
                </Router>
            ) : (
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
            )}
        </div>
    );
}

export default Login;
