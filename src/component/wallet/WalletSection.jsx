import React, { useState } from 'react';
import './WalletSection.css';

const WalletSection = ({ wallet, onAddMoney }) => {
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddMoney = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            await onAddMoney(parseFloat(amount));
            setAmount('');
            setShowAddMoney(false);
        } catch (error) {
            alert('Error adding money to wallet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wallet-section">
            <div className="wallet-card">
                <div className="wallet-header">
                    <h3>💰 My Wallet</h3>
                    <span className="wallet-balance">₹{wallet?.balance || 0}</span>
                </div>
                
                <div className="wallet-stats">
                    <div className="stat">
                        <span>Total Added</span>
                        <p>₹{wallet?.totalAdded || 0}</p>
                    </div>
                    <div className="stat">
                        <span>Total Spent</span>
                        <p>₹{wallet?.totalSpent || 0}</p>
                    </div>
                    <div className="stat">
                        <span>Current Balance</span>
                        <p>₹{wallet?.balance || 0}</p>
                    </div>
                </div>

                <button 
                    className="add-money-btn"
                    onClick={() => setShowAddMoney(!showAddMoney)}
                >
                    {showAddMoney ? '✕ Cancel' : '➕ Add Money'}
                </button>

                {showAddMoney && (
                    <form onSubmit={handleAddMoney} className="add-money-form">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount (₹)"
                            min="100"
                            step="10"
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Add Money'}
                        </button>
                    </form>
                )}
            </div>

            {/* Transaction History */}
            {wallet?.transactions && wallet.transactions.length > 0 && (
                <div className="transaction-history">
                    <h4>📜 Recent Transactions</h4>
                    <div className="transactions-list">
                        {wallet.transactions.slice(0, 5).map((txn, idx) => (
                            <div key={idx} className={`transaction-item ${txn.type.toLowerCase()}`}>
                                <div className="txn-info">
                                    <span className="txn-type">
                                        {txn.type === 'ADD' && '✅ Added'}
                                        {txn.type === 'SPEND' && '💳 Spent'}
                                        {txn.type === 'REFUND' && '↩️ Refunded'}
                                    </span>
                                    <span className="txn-desc">{txn.description}</span>
                                </div>
                                <span className={`txn-amount ${txn.type.toLowerCase()}`}>
                                    {txn.type === 'ADD' ? '+' : txn.type === 'REFUND' ? '+' : '-'}₹{txn.amount}
                                </span>
                                <span className="txn-date">
                                    {new Date(txn.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletSection;
