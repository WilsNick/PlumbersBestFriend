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
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">🧺 Basket for Client {client.name}</h2>

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

            <div className="mt-6">
                <button
                    onClick={() => navigate(`/client/${clientId}`)}
                    className="text-blue-600 hover:underline"
                >
                    ← Back to Client
                </button>
            </div>
        </div>
    );
}

export default BasketPage;
