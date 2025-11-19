'use client';
import { useState } from 'react';
import { api, BusinessPlanInput } from '@/lib/api';

interface BusinessFormProps {
  type: string;
  onSubmit: (data: any) => void;
}

export default function BusinessForm({ type, onSubmit }: BusinessFormProps) {
  const [formData, setFormData] = useState({
    seats: 20,
    atv: 1050,
    hours: '8:00-19:00',
    area: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.area) {
      alert('立地イメージを選択してください');
      return;
    }
    
    if (formData.seats <= 0 || formData.atv <= 0) {
      alert('席数と客単価は1以上である必要があります');
      return;
    }
    
    setLoading(true);
    
    try {
      const input: BusinessPlanInput = { 
        type, 
        seats: formData.seats,
        atv: formData.atv,
        hours: formData.hours,
        area: formData.area
      };
      
      console.log('Sending request:', input);
      const result = await api.createPlan(input);
      console.log('Received result:', result);
      onSubmit(result);
    } catch (error: any) {
      console.error('Error creating plan:', error);
      console.error('Error response:', error?.response);
      
      let errorMessage = '計算中にエラーが発生しました';
      
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.status === 500) {
        errorMessage = 'サーバーエラーが発生しました。しばらく待ってから再度お試しください。';
      } else if (error?.response?.status === 400) {
        errorMessage = '入力データに問題があります。すべての項目を正しく入力してください。';
      } else if (!error?.response) {
        errorMessage = 'サーバーに接続できません。バックエンドが起動しているか確認してください。';
      }
      
      alert(`エラー: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-12">基本情報を入力してください</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">席数</label>
            <input
              type="number"
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">想定客単価（円）</label>
            <input
              type="number"
              value={formData.atv}
              onChange={(e) => setFormData({ ...formData, atv: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">営業時間</label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">立地イメージ</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
              required
            >
              <option value="">選択してください</option>
              <option value="駅近">駅近</option>
              <option value="住宅街">住宅街</option>
              <option value="オフィス街">オフィス街</option>
              <option value="観光地">観光地</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '計算中...' : '計算する'}
          </button>
        </form>
      </div>
    </div>
  );
}



