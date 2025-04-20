import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ShopPage() {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [basket, setBasket] = useState([]);
    const [page, setPage] = useState(1);
    const [clientName, setClientName] = useState('');
    const [projectName, setProjectName] = useState('');  // Add state for project name
    const perPage = 10;

    useEffect(() => {
        fetch('/products.json')
            .then(res => res.json())
            .then(setProducts);
    }, []);

    useEffect(() => {
        const clients = JSON.parse(localStorage.getItem('clients') || '[]');
        const client = clients.find(c => String(c.id) === clientId);
        setClientName(client?.name || `Client ${clientId}`);
    }, [clientId]);

    useEffect(() => {
        const projects = JSON.parse(localStorage.getItem('projects') || '{}');
        const clientProjects = projects[clientId] || [];
        const project = clientProjects.find(p => p.id === projectId);
        setProjectName(project?.name || 'Onbekend Project');
    }, [clientId, projectId]);  // Add dependency for projectId

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('baskets') || '{}');
        const clientBaskets = saved[clientId] || {};
        const projectBasket = clientBaskets[projectId] || [];
        setBasket(projectBasket);
    }, [clientId, projectId]);

    const saveBasket = (newBasket) => {
        const allBaskets = JSON.parse(localStorage.getItem('baskets') || '{}');
        const clientBaskets = allBaskets[clientId] || {};
        clientBaskets[projectId] = newBasket;
        allBaskets[clientId] = clientBaskets;
        localStorage.setItem('baskets', JSON.stringify(allBaskets));
        setBasket(newBasket);
    };

    const updateBasketQuantity = (product, quantity) => {
        const existing = basket.find(p => p.product_id === product.product_id);

        if (quantity <= 0) {
            if (existing) {
                saveBasket(basket.filter(p => p.product_id !== product.product_id));
            }
        } else {
            if (existing) {
                const updated = basket.map(p =>
                    p.product_id === product.product_id ? { ...p, quantity } : p
                );
                saveBasket(updated);
            } else {
                saveBasket([...basket, { ...product, quantity }]);
            }
        }
    };

    const handleQuantityChange = (product, value) => {
        const qty = parseInt(value);
        if (isNaN(qty) || qty < 0) return;
        updateBasketQuantity(product, qty);
    };

    const increment = (product) => {
        const current = basket.find(p => p.product_id === product.product_id)?.quantity || 0;
        updateBasketQuantity(product, current + 1);
    };

    const decrement = (product) => {
        const current = basket.find(p => p.product_id === product.product_id)?.quantity || 0;
        updateBasketQuantity(product, current - 1);
    };

    const getQuantity = (productId) =>
        basket.find(p => p.product_id === productId)?.quantity || 0;

    const filtered = products.filter(p =>
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    const total = basket.reduce((sum, p) => {
        const price = parseFloat(p.price.replace(',', '.'));
        return sum + price * (p.quantity || 1);
    }, 0).toFixed(2);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
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
                    style={{ ...buttonStyle, backgroundColor: '#6c757d', marginRight: 20 }}
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
                    🛍️ {clientName}'s Winkel: <br/>
                    Project: {projectName} {/* Include project name */}
                </h1>
                <div style={{ width: 80 }} /> {/* Spacer */}
            </div>

            {/* Search */}
            <input
                placeholder="Zoek producten..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                style={{
                    width: '100%',
                    padding: '12px',
                    marginBottom: 20,
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    fontSize: '16px'
                }}
            />

            {/* Product Table */}
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={tableHeaderStyle}>Product</th>
                    <th style={tableHeaderStyle}>Artikel</th>
                    <th style={tableHeaderStyle}>Soort</th>
                    <th style={tableHeaderStyle}>Eenheid</th>
                    <th style={tableHeaderStyle}>Prijs</th>
                    <th style={tableHeaderStyle}>Hoeveelheid</th>
                    <th style={tableHeaderStyle}></th>
                </tr>
                </thead>
                <tbody>
                {paginated.map(p => {
                    const qty = getQuantity(p.product_id);
                    return (
                        <tr key={p.product_id} style={tableRowStyle}>
                            <td style={tableCellStyle}>{p.description}</td>
                            <td style={tableCellStyle}>{p.product_id}</td>
                            <td style={tableCellStyle}>{p.kind}</td>
                            <td style={tableCellStyle}>{p.unit}</td>
                            <td style={tableCellStyle}>€{p.price}</td>
                            <td style={tableCellStyle}>
                                <input
                                    type="number"
                                    min="0"
                                    value={qty}
                                    onChange={(e) => handleQuantityChange(p, e.target.value)}
                                    style={inputStyle}
                                />
                            </td>
                            <td style={tableCellStyle}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => decrement(p)} style={buttonStyle}>-</button>
                                    <button onClick={() => increment(p)} style={buttonStyle}>+</button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={paginationButtonStyle}>← Vorige</button>
                <span style={{ alignSelf: 'center' }}>Pagina {page} van {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={paginationButtonStyle}>Volgende →</button>
            </div>

            {/* Basket Section */}
            <h2 style={{ fontSize: '1.8rem', marginTop: 40 }}>🧺 Winkelmandje</h2>
            {basket.length === 0 ? <p>Geen artikels in jouw mandje.</p> : (
                <table style={tableStyle}>
                    <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Product</th>
                        <th style={tableHeaderStyle}>Hoeveelheid</th>
                        <th style={tableHeaderStyle}>Prijs</th>
                        <th style={tableHeaderStyle}>Totaal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {basket.map(p => {
                        const unitPrice = parseFloat(p.price.replace(',', '.'));
                        const lineTotal = (unitPrice * p.quantity).toFixed(2);
                        return (
                            <tr key={p.product_id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{p.description}</td>
                                <td style={tableCellStyle}>{p.quantity}</td>
                                <td style={tableCellStyle}>€{p.price}</td>
                                <td style={tableCellStyle}>€{lineTotal}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
            <p><strong>Totaal:</strong> €{total}</p>
        </div>
    );
}

// Reusable styles
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20,
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
};

const tableHeaderStyle = {
    padding: '12px 15px',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
    textAlign: 'left',
    color: '#999',
};

const tableRowStyle = {
    borderBottom: '1px solid #eee'
};

const tableCellStyle = {
    padding: '10px 15px',
    verticalAlign: 'middle'
};

const buttonStyle = {
    padding: '6px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const paginationButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff'
};

const inputStyle = {
    width: 60,
    padding: '5px',
    textAlign: 'center',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
};

export default ShopPage;
