import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ShopPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [basket, setBasket] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        fetch('/products.json')
            .then(res => res.json())
            .then(setProducts);
    }, []);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('baskets') || '{}');
        const clientBasket = saved[clientId] || [];
        setBasket(clientBasket);
    }, [clientId]);

    const saveBasket = (newBasket) => {
        const allBaskets = JSON.parse(localStorage.getItem('baskets') || '{}');
        allBaskets[clientId] = newBasket;
        localStorage.setItem('baskets', JSON.stringify(allBaskets));
        setBasket(newBasket);
    };

    const updateBasketQuantity = (product, quantity) => {
        const existing = basket.find(p => p.product_id === product.product_id);

        if (quantity <= 0) {
            // Remove if exists
            if (existing) {
                saveBasket(basket.filter(p => p.product_id !== product.product_id));
            }
        } else {
            if (existing) {
                // Update quantity
                const updated = basket.map(p =>
                    p.product_id === product.product_id ? { ...p, quantity } : p
                );
                saveBasket(updated);
            } else {
                // Add new
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
        <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
            <h2>Shop</h2>
            <input
                placeholder="Search products"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                style={{ width: '100%', marginBottom: 10 }}
            />

            {paginated.map(p => {
                const qty = getQuantity(p.product_id);
                return (
                    <div
                        key={p.product_id}
                        style={{
                            border: qty > 0 ? '2px solid #28a745' : '1px solid #ccc',
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 10,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: qty > 0 ? '#e6f9e6' : 'transparent'
                        }}
                    >
                        <div>
                            <strong>{p.description}</strong><br />
                            <span style={{ color: '#666' }}>€{p.price} / {p.unit}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button onClick={() => decrement(p)}>-</button>
                            <input
                                type="number"
                                min="0"
                                value={qty}
                                onChange={(e) => handleQuantityChange(p, e.target.value)}
                                style={{ width: 60, textAlign: 'center' }}
                            />
                            <button onClick={() => increment(p)}>+</button>
                        </div>
                    </div>
                );
            })}

            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>

            <h3>🛒 Basket</h3>
            {basket.length === 0 ? <p>No items</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th align="left">Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {basket.map(p => {
                        const unitPrice = parseFloat(p.price.replace(',', '.'));
                        const lineTotal = (unitPrice * p.quantity).toFixed(2);
                        return (
                            <tr key={p.product_id}>
                                <td>{p.description}</td>
                                <td>{p.quantity}</td>
                                <td>€{p.price}</td>
                                <td>€{lineTotal}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
            <p><strong>Total:</strong> €{total}</p>

            <button onClick={() => navigate(`/client/${clientId}`)}>← Back</button>
        </div>
    );
}

export default ShopPage;
