import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ClientPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);

    useEffect(() => {
        const allProjects = JSON.parse(localStorage.getItem('projects') || '{}');
        const clientProjects = allProjects[clientId] || [];
        setProjects(clientProjects);
    }, [clientId]);

    const handleAddProject = () => {
        if (!newProjectName.trim()) {
            setErrorMessage('Naam mag niet leeg zijn.');
            setShowErrorModal(true);
            return;
        }

        const duplicate = projects.find(p => p.name.toLowerCase() === newProjectName.trim().toLowerCase());
        if (duplicate) {
            setErrorMessage('Naam project moet uniek zijn.');
            setShowErrorModal(true);
            return;
        }

        const allProjects = JSON.parse(localStorage.getItem('projects') || '{}');
        const clientProjects = allProjects[clientId] || [];

        const newProject = {
            id: crypto.randomUUID(),
            name: newProjectName.trim(),
        };

        const updatedProjects = [...clientProjects, newProject];
        allProjects[clientId] = updatedProjects;

        localStorage.setItem('projects', JSON.stringify(allProjects));
        setProjects(updatedProjects);
        setNewProjectName('');
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            const allProjects = JSON.parse(localStorage.getItem('projects') || '{}');
            const allBaskets = JSON.parse(localStorage.getItem('baskets') || '{}');

            const clientProjects = allProjects[clientId] || [];
            const updatedProjects = clientProjects.filter(p => p.id !== projectToDelete);

            allProjects[clientId] = updatedProjects;

            // Remove project basket
            if (allBaskets[clientId] && allBaskets[clientId][projectToDelete]) {
                delete allBaskets[clientId][projectToDelete];

                // If client has no baskets left, remove the client entry too
                if (Object.keys(allBaskets[clientId]).length === 0) {
                    delete allBaskets[clientId];
                }
            }

            localStorage.setItem('projects', JSON.stringify(allProjects));
            localStorage.setItem('baskets', JSON.stringify(allBaskets));
            setProjects(updatedProjects);
            setShowConfirm(false);
        }
    };



    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

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
                <button onClick={() => navigate(`/dashboard`)} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>← Terug</button>
                <h1 style={{ fontSize: '2.2rem', color: 'white', flex: 1, textAlign: 'center', margin: 0 }}>
                    Klant: {client.name}
                </h1>
                <div style={{ width: 80 }} />
            </div>

            <button
                style={{ marginBottom: "20px", backgroundColor: "red", ...buttonStyle }}
                onClick={() => navigate(`/client/${clientId}/info`)}
            >
                Verander Informatie
            </button>

            <input
                type="text"
                placeholder="Zoek project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    marginBottom: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '1rem'
                }}
            />

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
                <thead>
                <tr>
                    <th style={thStyle}>Project Naam</th>
                    <th style={thStyle}>Acties</th>
                </tr>
                </thead>
                <tbody>
                {filteredProjects.map(project => (
                    <tr key={project.id}>
                        <td style={tdStyle}>{project.name}</td>
                        <td style={tdStyle}>
                            <button
                                style={{ ...buttonStyle, marginRight: 10 }}
                                onClick={() => navigate(`/client/${clientId}/project/${project.id}/shop`)}
                            >
                                🛒 Shop
                            </button>
                            <button
                                style={{ ...buttonStyle, backgroundColor: '#007bff' }}
                                onClick={() => navigate(`/client/${clientId}/project/${project.id}/basket`)}
                            >
                                🧺 Winkelmandje
                            </button>
                            <button
                                style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                                onClick={() => {
                                    setProjectToDelete(project.id);
                                    setShowConfirm(true);
                                }}
                            >
                                🗑️ Verwijder Project
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: 30 }}>
                <h3 style={{ color: 'white' }}>Nieuw Project Toevoegen</h3>
                <input
                    type="text"
                    placeholder="Project naam"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        marginRight: 10,
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />
                <button
                    onClick={handleAddProject}
                    style={{ ...buttonStyle, backgroundColor: '#28a745' }}
                >
                    ➕ Toevoegen
                </button>
            </div>

            {/* Error Modal for Duplicate Name */}
            {showErrorModal && (
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
                        <p>{errorMessage}</p>
                        <button onClick={() => setShowErrorModal(false)}>Sluiten</button>
                    </div>
                </div>
            )}

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
                        <p>Weet je zeker dat je dit project wilt verwijderen?</p>
                        <button onClick={handleDeleteProject} style={{ marginRight: 10 }}>Ja</button>
                        <button onClick={() => setShowConfirm(false)}>Annuleer</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const buttonStyle = {
    padding: '6px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const thStyle = {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#333',
    color: 'white',
    borderBottom: '1px solid #ccc'
};

const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #eee'
};

export default ClientPage;
