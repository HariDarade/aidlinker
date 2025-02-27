import Web3 from 'web3';
import { BlockchainEvent } from '../types';

// Mock data for demonstration purposes
const MOCK_EVENTS: BlockchainEvent[] = [
  {
    id: '1',
    event: 'DonationMade',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 12345678,
    from: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    amount: '0.5',
    timestamp: Math.floor(Date.now() / 1000) - 86400 // 1 day ago
  },
  {
    id: '2',
    event: 'DeliveryConfirmed',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 12345679,
    from: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    to: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    amount: '0.5',
    timestamp: Math.floor(Date.now() / 1000) - 43200 // 12 hours ago
  },
  {
    id: '3',
    event: 'DonationMade',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    blockNumber: 12345680,
    from: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    amount: '1.2',
    timestamp: Math.floor(Date.now() / 1000) - 21600 // 6 hours ago
  },
  {
    id: '4',
    event: 'DeliveryConfirmed',
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    blockNumber: 12345681,
    from: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    to: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    amount: '1.2',
    timestamp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
  }
];

// Get past events - mock implementation
export const getPastEvents = async (): Promise<BlockchainEvent[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [...MOCK_EVENTS];
};

// Subscribe to new events - mock implementation
export const subscribeToEvents = (callback: (event: BlockchainEvent) => void) => {
  // Simulate a new event coming in every 30 seconds
  const interval = setInterval(() => {
    const newEvent: BlockchainEvent = {
      id: `mock-${Date.now()}`,
      event: Math.random() > 0.5 ? 'DonationMade' : 'DeliveryConfirmed',
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      blockNumber: 12345682 + Math.floor(Math.random() * 100),
      from: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      amount: (Math.random() * 2).toFixed(2),
      timestamp: Math.floor(Date.now() / 1000)
    };
    callback(newEvent);
  }, 30000); // Every 30 seconds

  // Return a cleanup function
  return () => clearInterval(interval);
};

// Note: In a real implementation, you would use Web3.js to connect to an Ethereum node
// and interact with the smart contract. The code below is commented out as a reference.

/*
// ABI for the AidLink smart contract
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "name": "DonationMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "requestId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "supplier",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "DeliveryConfirmed",
    "type": "event"
  }
];

// Contract address on Ropsten testnet
const CONTRACT_ADDRESS = '0x123456789abcdef123456789abcdef123456789a';

// Initialize Web3 with Ropsten provider
const web3 = new Web3('https://ropsten.infura.io/v3/YOUR_INFURA_KEY');

// Create contract instance
const contract = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);

// Get past events
export const getPastEvents = async (fromBlock = 0): Promise<BlockchainEvent[]> => {
  try {
    const events = await contract.getPastEvents('allEvents', {
      fromBlock,
      toBlock: 'latest'
    });

    return Promise.all(events.map(async (event) => {
      const block = await web3.eth.getBlock(event.blockNumber);
      
      return {
        id: `${event.id}`,
        event: event.event || 'Unknown',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        from: event.returnValues.from || '',
        to: event.returnValues.to || '',
        amount: event.returnValues.amount ? web3.utils.fromWei(event.returnValues.amount, 'ether') : '0',
        timestamp: block.timestamp
      };
    }));
  } catch (error) {
    console.error('Error fetching blockchain events:', error);
    return [];
  }
};

// Subscribe to new events
export const subscribeToEvents = (callback: (event: BlockchainEvent) => void) => {
  contract.events.allEvents({}, async (error, event) => {
    if (error) {
      console.error('Error in event subscription:', error);
      return;
    }

    try {
      const block = await web3.eth.getBlock(event.blockNumber);
      
      const blockchainEvent: BlockchainEvent = {
        id: `${event.id}`,
        event: event.event || 'Unknown',
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        from: event.returnValues.from || '',
        to: event.returnValues.to || '',
        amount: event.returnValues.amount ? web3.utils.fromWei(event.returnValues.amount, 'ether') : '0',
        timestamp: block.timestamp
      };
      
      callback(blockchainEvent);
    } catch (error) {
      console.error('Error processing event:', error);
    }
  });
};
*/