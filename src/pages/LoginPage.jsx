import { useState } from 'react';

function LoginPage({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
