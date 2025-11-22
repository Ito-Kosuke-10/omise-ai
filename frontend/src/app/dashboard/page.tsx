'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, BusinessPlanOutput } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<BusinessPlanOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // 過去のシミュレーション結果を取得
    const fetchPlans = async () => {
      try {
        const data = await api.getMyPlans();
        setPlans(data);
      } catch (err: any) {
        console.error('Error fetching plans:', err);
        if (err?.response?.status === 401) {
          // 認証エラーの場合、ログインページにリダイレクト
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          setError('シミュレーション結果の取得に失敗しました');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              ダッシュボード
            </span>
          </h1>
          <p className="text-gray-600">
            過去のシミュレーション結果を確認できます
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-blue-100">
            <p className="text-gray-600 mb-4">まだシミュレーション結果がありません</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors"
            >
              新しいシミュレーションを開始
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  // 将来的に詳細ページに遷移
                  console.log('Plan clicked:', plan.id);
                }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.type}</h3>
                  <p className="text-sm text-gray-600">{plan.area}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">月間売上</span>
                    <span className="font-semibold text-blue-600">
                      ¥{plan.monthly_sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">営業利益</span>
                    <span className={`font-semibold ${plan.op_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {plan.op_income >= 0 ? '+' : ''}¥{plan.op_income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">回収期間</span>
                    <span className="font-semibold text-gray-800">{plan.payback_months}ヶ月</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {new Date(plan.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

