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
        <div style={{ padding: 20 }}>
            <h2>Clients</h2>
            <button onClick={onLogout}>Log Out</button>

            <input
                placeholder="Search clients"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginRight: 10 }}
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
                <h3>Add Client</h3>
                <input
                    placeholder="Client name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={addClient}>Add</button>

                <button
                    onClick={() => setShowArchived(prev => !prev)}
                    className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                    {showArchived ? '🙈 Hide Archived Clients' : '🗃️ Show Archived Clients'}
                </button>
            </div>
        </div>
    );
}

export default ClientsPage;
