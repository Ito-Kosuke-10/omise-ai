'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // バリデーション
      if (!formData.email || !formData.password) {
        setError('メールアドレスとパスワードを入力してください');
        setLoading(false);
        return;
      }

      // ログイン
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      // JWTトークンをlocalStorageに保存
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('ログイン中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              ログイン
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            アカウントにログインして、詳細シミュレーション機能をご利用ください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="example@email.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-700">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="パスワードを入力"
              required
              maxLength={72}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない方は{' '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              ユーザー登録
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

