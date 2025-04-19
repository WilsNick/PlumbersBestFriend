import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ClientInfoPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = storedClients.find(c => c.id === clientId);

    const [newName, setNewName] = useState(client?.name || '');
    const [isArchived, setIsArchived] = useState(client?.archived || false);

    const handleRename = () => {
        if (!newName.trim()) return alert('Name cannot be empty');
        const duplicate = storedClients.find(c => c.name.toLowerCase() === newName.toLowerCase() && c.id !== clientId);
        if (duplicate) return alert('Name must be unique');

        const updatedClients = storedClients.map(c =>
            c.id === clientId ? { ...c, name: newName } : c
        );
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        navigate(`/client/${clientId}`);
    };

    const handleArchiveToggle = () => {
        const updatedClients = storedClients.map(c =>
            c.id === clientId ? { ...c, archived: !isArchived } : c
        );
        setIsArchived(!isArchived); // Toggle the local state for immediate UI update
        localStorage.setItem('clients', JSON.stringify(updatedClients));
    };

    if (!client) return <div>Client not found</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Edit Client Info</h2>
            <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleRename}>Save</button>
            <button onClick={() => navigate(`/client/${clientId}`)}>← Back</button>

            {/* Archive/Unarchive Button */}
            <div style={{ marginTop: 20 }}>
                <button
                    onClick={handleArchiveToggle}
                    style={{
                        backgroundColor: isArchived ? 'green' : 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {isArchived ? 'Undo Archive' : 'Archive Client'}
                </button>
            </div>
        </div>
    );
}

export default ClientInfoPage;
