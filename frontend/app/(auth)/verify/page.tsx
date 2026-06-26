'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, VerifyEmailRequest } from '@/lib/api';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.verifyEmail({ email, code });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Verify Email</h1>
          <p className="text-neutral-400 mb-8">
            Enter the verification code sent to<br />
            <span className="text-blue-400">{email || 'your email'}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-900/20 border border-green-800 rounded p-3">
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-300 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <p className="text-neutral-400 text-xs">
              Check your email for the verification code. It may take a few minutes to arrive.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-2 px-4 rounded transition"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <p className="text-neutral-400 text-sm">
              Already verified?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Go to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
