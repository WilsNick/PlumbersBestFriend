import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('loggedIn');
        navigate('/');
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

export default Dashboard;
