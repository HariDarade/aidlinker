import { Transaction } from '../types';

// Mock socket implementation
let callbacks: ((transaction: Transaction) => void)[] = [];
let mockInterval: NodeJS.Timeout | null = null;

export const initializeSocket = () => {
  console.log('Socket initialized');
  
  // Start mock event generation if not already running
  if (!mockInterval) {
    mockInterval = setInterval(() => {
      // Generate a random transaction update every 15 seconds
      const statuses: ('pending' | 'confirmed' | 'delivered')[] = ['pending', 'confirmed', 'delivered'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const mockTransaction: Transaction = {
        id: Math.random() > 0.5 ? '1' : '2', // Use existing IDs to simulate updates
        requestId: Math.random() > 0.5 ? '1' : '2',
        donorId: '1',
        institutionId: '2',
        supplierId: randomStatus === 'delivered' ? '3' : undefined,
        amount: Math.floor(Math.random() * 1000) + 100,
        status: randomStatus,
        txHash: randomStatus !== 'pending' ? `0x${Math.random().toString(16).substring(2)}` : undefined,
        createdAt: new Date().toISOString(),
      };
      
      // Notify all subscribers
      callbacks.forEach(callback => callback(mockTransaction));
    }, 15000);
  }
  
  return {
    on: (event: string, callback: any) => {
      console.log(`Subscribed to ${event}`);
    },
    emit: (event: string, data: any) => {
      console.log(`Emitted ${event}`, data);
    },
    disconnect: () => {
      console.log('Socket disconnected');
      if (mockInterval) {
        clearInterval(mockInterval);
        mockInterval = null;
      }
    },
  };
};

export const subscribeToTransactions = (callback: (transaction: Transaction) => void) => {
  callbacks.push(callback);
  
  return () => {
    callbacks = callbacks.filter(cb => cb !== callback);
  };
};

export const joinUserRoom = (userId: string) => {
  console.log(`Joined room for user ${userId}`);
};

export const leaveUserRoom = (userId: string) => {
  console.log(`Left room for user ${userId}`);
};

export const disconnectSocket = () => {
  console.log('Socket disconnected');
  if (mockInterval) {
    clearInterval(mockInterval);
    mockInterval = null;
  }
  callbacks = [];
};