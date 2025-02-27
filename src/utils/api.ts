import axios from 'axios';
import { Request, Transaction, User } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'donor@example.com',
  role: 'donor',
  points: 120,
  badges: [
    {
      id: '1',
      name: 'First Donation',
      description: 'Made your first donation',
      image: 'https://cdn-icons-png.flaticon.com/512/2583/2583344.png',
    },
    {
      id: '2',
      name: 'Generous Donor',
      description: 'Donated more than $100',
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png',
    },
  ],
};

const MOCK_INSTITUTION_USER: User = {
  id: '2',
  name: 'Red Cross',
  email: 'institution@example.com',
  role: 'institution',
};

const MOCK_SUPPLIER_USER: User = {
  id: '3',
  name: 'Medical Supplies Inc.',
  email: 'supplier@example.com',
  role: 'supplier',
};

const MOCK_REQUESTS: Request[] = [
  {
    id: '1',
    title: 'Medical Supplies for Community Clinic',
    description: 'We need basic medical supplies for our community clinic that serves underprivileged neighborhoods.',
    amount: 500,
    institution: {
      id: '2',
      name: 'Red Cross',
    },
    status: 'open',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: '2',
    title: 'Emergency Food Supplies',
    description: 'Funding needed for emergency food supplies for families affected by recent flooding.',
    amount: 1000,
    institution: {
      id: '2',
      name: 'Red Cross',
    },
    status: 'funded',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
  {
    id: '3',
    title: 'School Supplies for Children',
    description: 'Help us provide school supplies for 100 children from low-income families.',
    amount: 750,
    institution: {
      id: '4',
      name: 'Education First',
    },
    status: 'open',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '4',
    title: 'Clean Water Initiative',
    description: 'Funding for water purification systems in rural communities.',
    amount: 1200,
    institution: {
      id: '5',
      name: 'Water for All',
    },
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    requestId: '2',
    donorId: '1',
    institutionId: '2',
    supplierId: '3',
    amount: 1000,
    status: 'confirmed',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: '2',
    requestId: '1',
    donorId: '1',
    institutionId: '2',
    amount: 200,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Auth
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'donor@example.com' && password === 'password123') {
    return { user: MOCK_USER, token: 'mock-token-donor' };
  } else if (email === 'institution@example.com' && password === 'password123') {
    return { user: MOCK_INSTITUTION_USER, token: 'mock-token-institution' };
  } else if (email === 'supplier@example.com' && password === 'password123') {
    return { user: MOCK_SUPPLIER_USER, token: 'mock-token-supplier' };
  }
  
  throw new Error('Invalid credentials');
};

// Donor
export const getOpenRequests = async (): Promise<Request[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return MOCK_REQUESTS.filter(req => req.status === 'open');
};

export const donate = async (requestId: string, amount: number): Promise<Transaction> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newTransaction: Transaction = {
    id: `tx-${Date.now()}`,
    requestId,
    donorId: '1',
    institutionId: '2',
    amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  MOCK_TRANSACTIONS.push(newTransaction);
  
  // Update request status if fully funded
  const request = MOCK_REQUESTS.find(r => r.id === requestId);
  if (request) {
    request.status = 'funded';
  }
  
  return newTransaction;
};

export const getDonorDashboard = async (): Promise<{ user: User; donations: Transaction[] }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    user: MOCK_USER,
    donations: MOCK_TRANSACTIONS.filter(tx => tx.donorId === '1'),
  };
};

// Institution
export const createRequest = async (data: { title: string; description: string; amount: number }): Promise<Request> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newRequest: Request = {
    id: `req-${Date.now()}`,
    title: data.title,
    description: data.description,
    amount: data.amount,
    institution: {
      id: '2',
      name: 'Red Cross',
    },
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  
  MOCK_REQUESTS.push(newRequest);
  
  return newRequest;
};

export const getInstitutionRequests = async (): Promise<Request[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return MOCK_REQUESTS.filter(req => req.institution.id === '2');
};

// Supplier
export const getSupplierTransactions = async (): Promise<Transaction[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return MOCK_TRANSACTIONS.filter(tx => tx.status === 'confirmed' || tx.supplierId === '3');
};

export const confirmDelivery = async (transactionId: string): Promise<Transaction> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const transaction = MOCK_TRANSACTIONS.find(tx => tx.id === transactionId);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  transaction.status = 'delivered';
  transaction.supplierId = '3';
  
  return transaction;
};

// Set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Initialize token from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};