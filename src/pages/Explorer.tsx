import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getPastEvents, subscribeToEvents } from '../utils/web3';
import { BlockchainEvent } from '../types';
import BlockchainEventCard from '../components/BlockchainEventCard';
import { Search, RefreshCw } from 'lucide-react';

const Explorer: React.FC = () => {
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getPastEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching blockchain events:', err);
        setError('Failed to load blockchain events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to new blockchain events
    subscribeToEvents((event) => {
      setEvents((prev) => {
        // Check if this event already exists
        const exists = prev.some((e) => e.id === event.id);
        if (exists) {
          return prev;
        } else {
          // Add new event at the beginning
          return [event, ...prev];
        }
      });
    });
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getPastEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error refreshing blockchain events:', err);
      setError('Failed to refresh blockchain events. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.event.toLowerCase().includes(searchLower) ||
      event.txHash.toLowerCase().includes(searchLower) ||
      event.from.toLowerCase().includes(searchLower) ||
      event.to.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Blockchain Explorer</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all transactions on the AidLink smart contract
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by event, address, or transaction hash"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchTerm ? 'No events match your search criteria.' : 'No blockchain events found.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <BlockchainEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explorer;