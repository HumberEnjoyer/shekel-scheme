import React, { useState } from 'react';
function AddFunds({ token, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/account/funds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Number(amount) })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Funds added successfully!");
                setAmount('');
                if (onSuccess) onSuccess(data.newBalance)
            } else {
                alert(data.message || 'Error adding funds');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding funds');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4"> Add funds</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="amount" className="form-label"> Amount (Shekel Tokens)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Funds'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFunds;