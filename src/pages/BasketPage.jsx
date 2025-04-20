import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BasketPage() {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();
    const [basket, setBasket] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState({});

    // Load the clients and projects only once when the component mounts
    useEffect(() => {
        const loadedClients = JSON.parse(localStorage.getItem('clients') || '[]');
        const loadedProjects = JSON.parse(localStorage.getItem('projects') || '{}');
        setClients(loadedClients);
        setProjects(loadedProjects);
    }, []);

    useEffect(() => {
        // Ensure client and project are found before setting states
        const client = clients.find(c => c.id === clientId);
        if (client) {
            // Look for the project within the client's projects
            const project = projects[clientId]?.find(p => p.id === projectId);
            if (project) {
                setProjectName(project.name);
            } else {
                setProjectName('Project niet gevonden');
            }

            // Get the basket for the project if it exists
            const allBaskets = JSON.parse(localStorage.getItem('baskets') || '{}');
            const projectBasket = allBaskets[clientId]?.[projectId] || [];
            setBasket(projectBasket);
        }
    }, [clientId, projectId, clients, projects]); // dependencies only on actual client/project info

    const total = basket.reduce((sum, p) => {
        const price = parseFloat(p.price.replace(',', '.'));
        return sum + price * (p.quantity || 1);
    }, 0).toFixed(2);

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
                }}>
                    🧺 Winkelmandje van {clients.find(c => c.id === clientId)?.name || 'Onbekend'} <br/>
                    Project: {projectName}
                </h1>

                <div style={{ width: 80 }} /> {/* Spacer to balance layout */}
            </div>

            {basket.length === 0 ? (
                <p className="text-gray-500">No items in basket</p>
            ) : (
                <table className="w-full border-t text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2">Product</th>
                        <th className="text-center p-2">Hoeveelheid</th>
                        <th className="text-right p-2">Prijs artikel</th>
                        <th className="text-right p-2">Totaal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {basket.map(p => {
                        const price = parseFloat(p.price.replace(',', '.'));
                        const lineTotal = (price * p.quantity).toFixed(2);
                        return (
                            <tr key={p.product_id} className="border-t">
                                <td className="p-2">{p.description}</td>
                                <td className="text-center p-2">{p.quantity}</td>
                                <td className="text-right p-2">€{p.price}</td>
                                <td className="text-right p-2">€{lineTotal}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            <p className="text-right font-semibold text-lg mt-4" style={{color:"red"}}>Totaal: €{total}</p>
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

export default BasketPage;
