'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SignupPage() {
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

      if (formData.password.length < 8) {
        setError('パスワードは8文字以上である必要があります');
        setLoading(false);
        return;
      }

      // 72バイト制限のチェック（72バイトを超える場合のみエラー）
      const passwordBytes = new TextEncoder().encode(formData.password).length;
      if (passwordBytes > 72) {
        setError(`パスワードは72バイト以内で入力してください（現在${passwordBytes}バイトです。英数字のみなら72文字以内）`);
        setLoading(false);
        return;
      }

      // ユーザー登録
      const response = await api.register({
        email: formData.email,
        password: formData.password,
      });

      // JWTトークンをlocalStorageに保存
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('ユーザー登録中にエラーが発生しました');
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
              ユーザー登録
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            詳細シミュレーション機能をご利用いただくには、ユーザー登録が必要です
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
              placeholder="8文字以上"
              required
              minLength={8}
              maxLength={72}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              8文字以上、72バイト以内で入力してください（英数字のみなら72文字以内）
            </p>
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
            {loading ? '登録中...' : 'ユーザー登録'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              ログイン
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

