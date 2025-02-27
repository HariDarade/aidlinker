import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import DonorDashboard from './dashboards/DonorDashboard';
import InstitutionDashboard from './dashboards/InstitutionDashboard';
import SupplierDashboard from './dashboards/SupplierDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}!
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {user.role === 'donor' && <DonorDashboard />}
          {user.role === 'institution' && <InstitutionDashboard />}
          {user.role === 'supplier' && <SupplierDashboard />}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;