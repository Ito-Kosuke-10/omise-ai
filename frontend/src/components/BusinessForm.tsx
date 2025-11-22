'use client';
import { useState } from 'react';
import { api, BusinessPlanInput } from '@/lib/api';

interface BusinessFormProps {
  type: string;
  onSubmit: (data: any) => void;
}

interface OpeningSlot {
  label: string;
  start: string;
  end: string;
}

export default function BusinessForm({ type, onSubmit }: BusinessFormProps) {
  const [formData, setFormData] = useState({
    seats: 20,
    atv: 1050,
    area: '',
  });
  const [openingSlots, setOpeningSlots] = useState<OpeningSlot[]>([
    { label: 'ランチタイム', start: '11:00', end: '14:00' },
  ]);
  const [loading, setLoading] = useState(false);

  // 30分単位の時間オプションを生成
  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 営業時間枠を追加
  const addOpeningSlot = () => {
    if (openingSlots.length >= 4) {
      alert('営業時間枠は最大4つまで追加できます');
      return;
    }
    setOpeningSlots([...openingSlots, { label: '', start: '09:00', end: '17:00' }]);
  };

  // 営業時間枠を削除
  const removeOpeningSlot = (index: number) => {
    if (openingSlots.length <= 1) {
      alert('最低1つの営業時間枠が必要です');
      return;
    }
    setOpeningSlots(openingSlots.filter((_, i) => i !== index));
  };

  // 営業時間枠を更新
  const updateOpeningSlot = (index: number, field: keyof OpeningSlot, value: string) => {
    const updated = [...openingSlots];
    updated[index] = { ...updated[index], [field]: value };
    setOpeningSlots(updated);
  };

  // 営業時間を文字列形式に変換（バックエンド互換性のため）
  const formatHours = (slots: OpeningSlot[]): string => {
    return slots
      .filter(slot => slot.label && slot.start && slot.end)
      .map(slot => `${slot.label}:${slot.start}-${slot.end}`)
      .join(',');
  };

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

    // 営業時間のバリデーション
    const validSlots = openingSlots.filter(slot => slot.label && slot.start && slot.end);
    if (validSlots.length === 0) {
      alert('最低1つの営業時間枠を入力してください');
      return;
    }

    // 開始時間が終了時間より前かチェック
    for (const slot of validSlots) {
      if (slot.start >= slot.end) {
        alert(`${slot.label || '営業時間枠'}の開始時間は終了時間より前である必要があります`);
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const input: BusinessPlanInput = { 
        type, 
        seats: formData.seats,
        atv: formData.atv,
        hours: formatHours(validSlots),
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
          {/* 営業時間セクション */}
          <div>
            {/* タイトル */}
            <h3 className="text-2xl font-bold text-gray-800 mb-6">営業時間枠</h3>

            <div className="space-y-4">
              {openingSlots.map((slot, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    {/* 区分ラベル */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        区分ラベル
                      </label>
                      <input
                        type="text"
                        value={slot.label}
                        onChange={(e) => updateOpeningSlot(index, 'label', e.target.value)}
                        placeholder="例：ランチタイム"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors text-sm"
                        required
                      />
                    </div>

                    {/* 開始時間 */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        開始
                      </label>
                      <div className="relative">
                        <select
                          value={slot.start}
                          onChange={(e) => updateOpeningSlot(index, 'start', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors text-sm appearance-none"
                          required
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* 終了時間 */}
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        終了
                      </label>
                      <div className="relative">
                        <select
                          value={slot.end}
                          onChange={(e) => updateOpeningSlot(index, 'end', e.target.value)}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors text-sm appearance-none"
                          required
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* 削除ボタン */}
                    <div className="sm:col-span-1">
                      {openingSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOpeningSlot(index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          枠を削除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 追加ボタンと制約テキスト */}
            <div className="mt-4 flex items-center gap-4">
              {openingSlots.length < 4 && (
                <button
                  type="button"
                  onClick={addOpeningSlot}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  営業枠を追加
                </button>
              )}
              <span className="text-xs text-gray-500">
                最大4枠まで登録できます。
              </span>
            </div>
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



