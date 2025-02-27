import React from 'react';
import { BlockchainEvent } from '../types';
import { Calendar, Hash, ArrowRight } from 'lucide-react';

interface BlockchainEventCardProps {
  event: BlockchainEvent;
}

const BlockchainEventCard: React.FC<BlockchainEventCardProps> = ({ event }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.event}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            Block #{event.blockNumber}
          </span>
        </div>
        <div className="flex flex-col space-y-3 mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <Hash className="h-4 w-4 mr-1 flex-shrink-0" />
            <a
              href={`https://ropsten.etherscan.io/tx/${event.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 truncate"
            >
              {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
            </a>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{formatDate(event.timestamp)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-gray-600">{formatAddress(event.from)}</span>
              <ArrowRight className="h-4 w-4 mx-2" />
              <span className="text-gray-600">{formatAddress(event.to)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">Amount:</span> {event.amount} ETH
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainEventCard;