// src/login.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import App from './App';

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
            console.log("Please provide a valid username and password")
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
                <>
                    <div className='mx-auto'>
                        <h1>Login</h1>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Username</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="username" placeholder="username" value={username} onChange={(event) => setUsername(event.target.value)} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" className="form-control" id="password" placeholder="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                            </div>
                        </div>
                        <br />
                        <button type="submit">Login</button>
                    </form>

                </>
            )}
        </div>
    );
}


export default Login;
