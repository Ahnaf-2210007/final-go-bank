'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { api, AccountResponse } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAccount = async () => {
      const token = auth.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.getAccount(token);
      if (response.error) {
        setError(response.error);
        auth.logout();
        router.push('/login');
      } else if (response.data) {
        setAccount(response.data);
      }
      setLoading(false);
    };

    loadAccount();
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">GoBank</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {account && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                Welcome, {account.firstName}!
              </h2>
              <p className="text-blue-100">Manage your banking needs securely</p>
            </div>

            {/* Account Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Card */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-neutral-400 text-sm font-semibold mb-4">Account Number</h3>
                <p className="text-2xl font-bold text-white mb-2">{account.number}</p>
                <p className="text-neutral-500 text-sm">
                  {account.firstName} {account.lastName}
                </p>
              </div>

              {/* Balance Card */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6">
                <h3 className="text-neutral-400 text-sm font-semibold mb-4">Account Balance</h3>
                <p className="text-3xl font-bold text-green-400">
                  ${account.balance.toFixed(2)}
                </p>
                <p className="text-neutral-500 text-sm">Available funds</p>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-8 text-center">
              <p className="text-neutral-400 text-lg mb-4">More features coming in Phase 2</p>
              <div className="space-y-2 text-sm text-neutral-500">
                <p>• Money Transfers</p>
                <p>• Transaction History</p>
                <p>• Coupon Redemption</p>
                <p>• WebAuthn Biometric Auth</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
