import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ClientInfoPage from './pages/ClientInfoPage';
import ShopPage from './pages/ShopPage';
import BasketPage from './pages/BasketPage';

import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import ClientPage from './pages/ClientPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check login status on first load
    useEffect(() => {
        const stored = localStorage.getItem('loggedIn');
        if (stored === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (password) => {
        if (password === 'NIG!') {
            localStorage.setItem('loggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/dashboard');
        } else {
            alert('Incorrect password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
            <Route
                path="/dashboard"
                element={isLoggedIn ? <ClientsPage onLogout={handleLogout} /> : <Navigate to="/" />}
            />
            <Route
                path="/client/:clientId"
                element={isLoggedIn ? <ClientPage /> : <Navigate to="/" />}
            />
            <Route
                path="/client/:clientId/info"
                element={isLoggedIn ? <ClientInfoPage /> : <Navigate to="/" />}
            />
            <Route
                path="/client/:clientId/shop"
                element={isLoggedIn ? <ShopPage /> : <Navigate to="/" />}
            />
            <Route path="/client/:clientId/basket" element={<BasketPage />} />
        </Routes>
    );
}

export default App;
