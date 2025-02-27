import React, { useState, useEffect } from 'react';
import { getSupplierTransactions, confirmDelivery } from '../../utils/api';
import { Transaction } from '../../types';
import TransactionCard from '../../components/TransactionCard';
import { subscribeToTransactions } from '../../utils/socket';

const SupplierDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingDelivery, setProcessingDelivery] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getSupplierTransactions();
        setTransactions(data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Subscribe to real-time transaction updates
    const unsubscribe = subscribeToTransactions((transaction) => {
      setTransactions((prev) => {
        // Check if this transaction already exists
        const exists = prev.some((t) => t.id === transaction.id);
        if (exists) {
          // Update existing transaction
          return prev.map((t) => (t.id === transaction.id ? transaction : t));
        } else {
          // Add new transaction
          return [...prev, transaction];
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleConfirmDelivery = async (transaction: Transaction) => {
    try {
      setProcessingDelivery(transaction.id);
      const updatedTransaction = await confirmDelivery(transaction.id);
      
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
    } catch (err) {
      console.error('Error confirming delivery:', err);
      setError('Failed to confirm delivery. Please try again.');
    } finally {
      setProcessingDelivery(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter transactions by status
  const pendingTransactions = transactions.filter((t) => t.status === 'pending');
  const confirmedTransactions = transactions.filter((t) => t.status === 'confirmed');
  const deliveredTransactions = transactions.filter((t) => t.status === 'delivered');

  return (
    <div>
      {/* Pending Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Transactions</h2>
        {pendingTransactions.length === 0 ? (
          <p className="text-gray-500">No pending transactions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready for Delivery</h2>
        {confirmedTransactions.length === 0 ? (
          <p className="text-gray-500">No transactions ready for delivery.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confirmedTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onConfirmDelivery={handleConfirmDelivery}
                showConfirmButton={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delivered Transactions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivered</h2>
        {deliveredTransactions.length === 0 ? (
          <p className="text-gray-500">No delivered transactions.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;