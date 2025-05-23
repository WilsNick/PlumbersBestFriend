import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('loggedIn');
        if (stored === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLoginClick = () => {
        if (password === '') {
            setError('Password cannot be empty');
        } else {
            onLogin(password);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Login</h2>
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginRight: 10 }}
            />
            <button onClick={handleLoginClick}>Log In</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
