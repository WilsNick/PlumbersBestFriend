import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BasketPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [basket, setBasket] = useState([]);

    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    useEffect(() => {
        const allBaskets = JSON.parse(localStorage.getItem('baskets') || '{}');
        setBasket(allBaskets[clientId] || []);
    }, [clientId]);

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
                    ← Back
                </button>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    flex: 1,
                    color: 'white',
                    margin: 0
                }}>🧺 Basket for Client {client.name}</h1>

                <div style={{ width: 80 }} /> {/* Spacer to balance layout */}
            </div>

            {basket.length === 0 ? (
                <p className="text-gray-500">No items in basket</p>
            ) : (
                <table className="w-full border-t text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left p-2">Product</th>
                        <th className="text-center p-2">Qty</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-right p-2">Total</th>
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

            <p className="text-right font-semibold text-lg mt-4">Total: €{total}</p>


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
