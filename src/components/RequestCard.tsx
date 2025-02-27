import React from 'react';
import { Request } from '../types';
import { Calendar, Building, DollarSign } from 'lucide-react';

interface RequestCardProps {
  request: Request;
  onDonate?: (request: Request) => void;
  showDonateButton?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onDonate,
  showDonateButton = false,
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
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              request.status === 'open'
                ? 'bg-green-100 text-green-800'
                : request.status === 'funded'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{request.description}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Building className="h-4 w-4 mr-1" />
            <span>{request.institution.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created: {formatDate(request.createdAt)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>Amount: ${request.amount.toFixed(2)}</span>
          </div>
        </div>
        {showDonateButton && request.status === 'open' && (
          <div className="mt-4">
            <button
              onClick={() => onDonate && onDonate(request)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Donate Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;