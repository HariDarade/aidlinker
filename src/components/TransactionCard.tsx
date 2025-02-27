import React from 'react';
import { Transaction } from '../types';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onConfirmDelivery?: (transaction: Transaction) => void;
  showConfirmButton?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onConfirmDelivery,
  showConfirmButton = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Transaction #{transaction.id.slice(0, 8)}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              transaction.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : transaction.status === 'confirmed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </span>
        </div>
        <div className="flex flex-col space-y-2 mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Amount: ${transaction.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Date: {formatDate(transaction.createdAt)}</span>
          </div>
          {transaction.txHash && (
            <div className="flex items-start text-sm text-gray-500">
              <span className="mr-1">Tx Hash:</span>
              <a
                href={`https://ropsten.etherscan.io/tx/${transaction.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 truncate"
              >
                {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-8)}
              </a>
            </div>
          )}
        </div>
        {showConfirmButton && transaction.status === 'confirmed' && (
          <div className="mt-4">
            <button
              onClick={() => onConfirmDelivery && onConfirmDelivery(transaction)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;