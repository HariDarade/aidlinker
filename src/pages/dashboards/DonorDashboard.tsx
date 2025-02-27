import React, { useState, useEffect } from 'react';
import { getOpenRequests, donate, getDonorDashboard } from '../../utils/api';
import { Request, Transaction } from '../../types';
import RequestCard from '../../components/RequestCard';
import TransactionCard from '../../components/TransactionCard';
import DonateModal from '../../components/DonateModal';
import Badge from '../../components/Badge';
import { subscribeToTransactions } from '../../utils/socket';
import { Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [requestsData, dashboardData] = await Promise.all([
          getOpenRequests(),
          getDonorDashboard(),
        ]);
        
        setRequests(requestsData);
        setDonations(dashboardData.donations);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time transaction updates
    const unsubscribe = subscribeToTransactions((transaction) => {
      setDonations((prev) => {
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

  const handleDonate = async (requestId: string, amount: number) => {
    try {
      const transaction = await donate(requestId, amount);
      setDonations((prev) => [...prev, transaction]);
      return transaction;
    } catch (error) {
      console.error('Error making donation:', error);
      throw error;
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

  return (
    <div>
      {/* Points and Badges */}
      <div className="mb-8 bg-blue-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-blue-600" />
              Your Impact
            </h2>
            <p className="text-gray-600 mt-1">
              You've earned {user?.points || 0} impact points through your donations
            </p>
          </div>
          {user?.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {user.badges.map((badge) => (
                <Badge key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Open Requests and Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Open Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No open requests at the moment.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onDonate={() => setSelectedRequest(request)}
                  showDonateButton={true}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Donations</h2>
          {donations.length === 0 ? (
            <p className="text-gray-500">You haven't made any donations yet.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {selectedRequest && (
        <DonateModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onDonate={handleDonate}
        />
      )}
    </div>
  );
};

export default DonorDashboard;