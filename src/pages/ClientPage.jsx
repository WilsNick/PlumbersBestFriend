import { useParams, useNavigate } from 'react-router-dom';

function ClientPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);

    if (!client) return <div>Client not found</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Client: {client.name}</h2>
            <button onClick={() => navigate(`/client/${clientId}/info`)}>Edit Info</button>
            <button onClick={() => navigate(`/client/${clientId}/shop`)}>Go to Shop</button>
            <button
                onClick={() => navigate(`/client/${client.id}/basket`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-4"
            >
                🧺 View Basket
            </button>

            <button onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
    );
}

export default ClientPage;
