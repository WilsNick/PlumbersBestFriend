import { useParams, useNavigate } from 'react-router-dom';

function ClientPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);

    if (!client) return <div>Client not found</div>;

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
                paddingBottom: 10,
                borderBottom: '2px solid #ccc'
            }}>
                <button
                    onClick={() => navigate(`/dashboard`)}
                    style={{
                        ...buttonStyle,
                        backgroundColor: '#6c757d',
                        marginRight: 20
                    }}
                >
                    ← Back
                </button>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    flex: 1,
                    color: 'white',
                    margin: 0
                }}>Client: {client.name}</h1>

                <div style={{ width: 80 }} /> {/* Spacer to balance layout */}
            </div>
            <div >
                <button style={{ marginBottom:"15px", backgroundColor: "red" }} onClick={() => navigate(`/client/${clientId}/info`)}>Edit Info</button>

            </div>
            <button style={{ marginRight:"15px", backgroundColor: "green" }} onClick={() => navigate(`/client/${clientId}/shop`)}>Go to Shop</button>
            <button
                onClick={() => navigate(`/client/${client.id}/basket`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mt-4"
            >
                🧺 View Basket
            </button>

        </div>
    );
}

const buttonStyle = {
    padding: '6px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
};

export default ClientPage;
