import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientsPage({ onLogout }) {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('clients') || '[]');
        setClients(saved);
    }, []);

    // Save to localStorage
    const saveClients = (newClients) => {
        setClients(newClients);
        localStorage.setItem('clients', JSON.stringify(newClients));
    };

    const addClient = () => {
        if (!name.trim()) return alert('Enter a name');
        const id = crypto.randomUUID();
        const exists = clients.some(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) return alert('Client name must be unique');
        const newClients = [...clients, { id, name, archived: false }];
        saveClients(newClients);
        setName('');
    };

    // Filter clients based on search and archived state
    const filtered = clients.filter(c =>
        (showArchived || !c.archived) && c.name.toLowerCase().includes(search.toLowerCase())
    );

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
            <h1 style={{
                textAlign: 'center',
                fontSize: '2.2rem',
                flex: 1,
                color: 'white',
                margin: 0
            }}>Clients</h1>
            </div>

            {/*<h2>Clients</h2>*/}
            {/*<button onClick={onLogout}>Log Out</button>*/}

            <input
                placeholder="Search clients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: 20,
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                }}
            />

            <ul>
                {filtered.map(client => (
                    <li key={client.id}>
                        <button onClick={() => navigate(`/client/${client.id}`)}>
                            {client.name} {client.archived ? '(Archived)' : ''}
                        </button>
                    </li>
                ))}
            </ul>

            <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: '1.8rem', marginTop: 40 }}>Add Client</h2>
                <input
                    placeholder="Client name"
                    value={name}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: 20,
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div style={{ marginTop: 20 }}>


            <button
                onClick={addClient}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '16px',
                    marginRight: '15px',

                    cursor: 'pointer'
                }}
            >
                Add
            </button>

                <button
                    onClick={() => setShowArchived(prev => !prev)}
                    style={{
                        backgroundColor: 'orange',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '15px',
                        marginRight: '15px',
                        fontSize: '16px',
                        border: 'none',
                    }}
                >
                    {showArchived ? '🙈 Hide Archived Clients' : '🗃️ Show Archived Clients'}
                </button>
            </div>

        </div>
    );
}

export default ClientsPage;
