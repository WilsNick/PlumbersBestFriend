import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ClientInfoPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const storedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = storedClients.find(c => c.id === clientId);

    const [newName, setNewName] = useState(client?.name || '');
    const [isArchived, setIsArchived] = useState(client?.archived || false);
    const [showConfirm, setShowConfirm] = useState(false); // State for showing the confirmation modal

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

    const handleDeleteClient = () => {
        const updatedClients = storedClients.filter(c => c.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        navigate('/dashboard');
    };

    // Show the confirmation modal when the delete button is clicked
    const confirmDelete = () => {
        handleDeleteClient();
        setShowConfirm(false); // Close the modal after deletion
    };

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
                onClick={() => navigate(`/client/${clientId}`)}
                style={{
                    ...buttonStyle,
                    backgroundColor: '#6c757d',
                    marginRight: 20
                }}
            >
                ← Terug
            </button>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    flex: 1,
                    color: 'white',
                    margin: 0
                }}>Wijzig info klant</h1>
                <div style={{ width: 80 }} /> {/* Spacer to balance layout */}

            </div>

            <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleRename}
                    style={{
                            marginRight: '15px',
                            marginLeft: '15px',
                            backgroundColor: 'green'
                        }}
            >Opslaan</button>

            {/* Archive/Unarchive Button */}
            <div style={{ marginTop: 20 }}>
                <button
                    onClick={handleArchiveToggle}
                    style={{
                        backgroundColor: isArchived ? 'green' : 'orange',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '15px', // Added space between this button and the next
                        marginRight: '15px', // Added space between this button and the next
                    }}
                >
                    {isArchived ? 'archiveren ongedaan maken' : 'Archiveer klant'}
                </button>

                <button
                    onClick={() => setShowConfirm(true)} // Show the confirmation modal
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px', // Added space between this and the previous button
                    }}
                >
                    Verwijder klant
                </button>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        maxWidth: 300,
                        textAlign: 'center',
                        color: 'black',
                    }}>
                        <p>Weet je zeker dat je klant "{client.name}" wilt verwijderen?</p>
                        <button onClick={confirmDelete} style={{ marginRight: 10 }}>Ja</button>
                        <button onClick={() => setShowConfirm(false)}>Annuleer</button>
                    </div>
                </div>
            )}
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
export default ClientInfoPage;
