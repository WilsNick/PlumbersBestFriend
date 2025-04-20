import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientsPage({ onLogout }) {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // pagination

    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const CLIENTS_PER_PAGE = 5;

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('clients') || '[]');
        setClients(saved);
    }, []);

    const saveClients = (newClients) => {
        setClients(newClients);
        localStorage.setItem('clients', JSON.stringify(newClients));
    };

    const addClient = () => {
        if (!name.trim()) {
            setErrorMessage('Naam mag niet leeg zijn.');
            setShowErrorModal(true);
            return;
        }

        const exists = clients.some(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            setErrorMessage('Naam klant moet uniek zijn.');
            setShowErrorModal(true);
            return;
        }

        const id = crypto.randomUUID();
        const newClients = [...clients, { id, name, archived: false }];
        saveClients(newClients);
        setName('');
    };

    const handleExport = () => {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const projects = JSON.parse(localStorage.getItem('projects') || '{}');
        const baskets = JSON.parse(localStorage.getItem('baskets') || '{}');

        const data = { clients, projects, baskets };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.clients || !data.projects || !data.baskets) {
                    alert('Invalid JSON file format.');
                    return;
                }

                localStorage.setItem('clients', JSON.stringify(data.clients));
                localStorage.setItem('projects', JSON.stringify(data.projects));
                localStorage.setItem('baskets', JSON.stringify(data.baskets));
                setClients(data.clients);
                setCurrentPage(1); // reset to first page
                alert('Gegevens succesvol geïmporteerd!');
            } catch (err) {
                alert('Kon JSON-bestand niet lezen.');
            }
        };
        reader.readAsText(file);
    };

    const filtered = clients.filter(c =>
        (showArchived || !c.archived) && c.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / CLIENTS_PER_PAGE);
    const paginatedClients = filtered.slice(
        (currentPage - 1) * CLIENTS_PER_PAGE,
        currentPage * CLIENTS_PER_PAGE
    );

    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

    useEffect(() => {
        // Reset to page 1 on new search
        setCurrentPage(1);
    }, [search, showArchived]);

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
                }}>Klanten</h1>
            </div>

            <input
                placeholder="Klanten zoeken"
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
                {paginatedClients.map(client => (
                    <li key={client.id}>
                        <button style={{ marginBottom: '15px' }} onClick={() => navigate(`/client/${client.id}`)}>
                            {client.name} {client.archived ? '(Archived)' : ''}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div style={{ marginTop: 10, marginBottom: 30 }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        style={{
                            marginRight: 10,
                            padding: '8px 16px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            backgroundColor: '#ccc',
                            border: 'none'
                        }}
                    >
                        Vorige
                    </button>
                    <span style={{ fontSize: '16px', margin: '0 10px' }}>
                        Pagina {currentPage} van {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{
                            marginLeft: 10,
                            padding: '8px 16px',
                            fontSize: '16px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            backgroundColor: '#ccc',
                            border: 'none'
                        }}
                    >
                        Volgende
                    </button>
                </div>
            )}

            <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: '1.8rem', marginTop: 40 }}>Klant toevoegen</h2>
                <input
                    placeholder="Naam klant"
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
                    Voeg toe
                </button>
            </div>

            <div style={{ marginTop: 20 }}>
                <button
                    onClick={() => setShowArchived(prev => !prev)}
                    style={{
                        backgroundColor: 'orange',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '15px',
                        fontSize: '16px',
                        border: 'none',
                    }}
                >
                    {showArchived ? 'Verberg gearchiveerde klanten' : 'Toon gearchiveerde klanten'}
                </button>

                <button
                    onClick={handleExport}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '15px',
                        fontSize: '16px',
                        border: 'none',
                    }}
                >
                    Exporteren
                </button>

                <label style={{
                    backgroundColor: '#9C27B0',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    border: 'none',
                }}>
                    Importeren
                    <input type="file" accept="application/json" onChange={handleImport} style={{ display: 'none' }} />
                </label>
            </div>

            {showErrorModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        maxWidth: 300,
                        textAlign: 'center',
                        color: 'black'
                    }}>
                        <p>{errorMessage}</p>
                        <button
                            onClick={() => setShowErrorModal(false)}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientsPage;
