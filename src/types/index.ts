export interface User {
  id: string;
  name: string;
  role: 'donor' | 'institution' | 'supplier';
  email: string;
  points?: number;
  badges?: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  amount: number;
  institution: {
    id: string;
    name: string;
  };
  status: 'open' | 'funded' | 'delivered';
  createdAt: string;
}

export interface Transaction {
  id: string;
  requestId: string;
  donorId: string;
  institutionId: string;
  supplierId?: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  txHash?: string;
  createdAt: string;
}

export interface BlockchainEvent {
  id: string;
  event: string;
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
}