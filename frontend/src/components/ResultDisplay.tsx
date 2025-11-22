'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BusinessPlanOutput } from '@/lib/api';

interface ResultDisplayProps {
  data: BusinessPlanOutput;
  onRestart: () => void;
}

type TabType = 'concept' | 'kpi' | 'menu' | 'strategy' | 'financial';

export default function ResultDisplay({ data, onRestart }: ResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'concept', label: 'コンセプト', icon: '💡' },
    { id: 'kpi', label: '基本KPI', icon: '📊' },
    { id: 'menu', label: 'メニュー例', icon: '🍽' },
    { id: 'strategy', label: '集客・オペ', icon: '🚀' },
    { id: 'financial', label: '収支・投資', icon: '💰' },
  ];

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || '';

  return (
    <div className="relative min-h-screen py-8 sm:py-12 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              あなたの開業プラン
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {data.type} × {data.area}
          </p>
        </div>

        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="overflow-x-auto scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="flex gap-3 sm:gap-4 min-w-max pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex flex-col items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-base whitespace-nowrap transition-all duration-300 min-w-[120px] sm:min-w-[140px] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl scale-105 transform'
                      : 'bg-white/95 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <span className={`text-2xl sm:text-3xl transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className={`font-bold ${
                    activeTab === tab.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* アクティブタブの見出し */}
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">
              {tabs.find(tab => tab.id === activeTab)?.icon}
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              {activeTabLabel}
            </span>
          </h3>
        </div>

        {/* タブコンテンツ */}
        <div className="space-y-6">
          {/* コンセプトタブ */}
          {activeTab === 'concept' && (
            <div className="space-y-4 sm:space-y-6">
              {data.catch_copy && (
                <div className="card">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">キャッチコピー</h3>
                      <p className="text-xl sm:text-2xl font-bold text-blue-600 leading-relaxed">{data.catch_copy}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="card">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📝</span>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">コンセプト文</h3>
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg italic">{data.concept}</p>
                  </div>
                </div>
              </div>

              {data.target_audience && (
                <div className="card">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">👥</span>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">想定ターゲット像</h3>
                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{data.target_audience}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🚀</span>
                  <span>今日の一歩</span>
                </h3>
                <p className="text-base sm:text-lg font-semibold leading-relaxed">{data.action}</p>
              </div>
            </div>
          )}

          {/* 基本KPIタブ */}
          {activeTab === 'kpi' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="card">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">基本指標</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-200">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">座席稼働率</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-700">
                      {data.seat_occupancy_rate ? Math.round(data.seat_occupancy_rate * 100) : 75}%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-200">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">回転率</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-700">{data.turnover.toFixed(1)}回転</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-200">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">平均客数/日</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-700">{data.daily_guests}人</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-200">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">客単価</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-700">¥{data.atv.toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-200">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-medium">席数</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-700">{data.seats}席</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 sm:p-5 text-center border-2 border-blue-500 col-span-2 sm:col-span-1 text-white shadow-lg">
                    <div className="text-xs sm:text-sm mb-1 sm:mb-2 font-medium opacity-90">月間売上</div>
                    <div className="text-2xl sm:text-3xl font-bold">¥{data.monthly_sales.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">営業情報</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-gray-600 mb-1">営業時間</div>
                    <div className="text-base font-semibold text-gray-800">{data.hours}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="text-sm text-gray-600 mb-1">立地</div>
                    <div className="text-base font-semibold text-gray-800">{data.area}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* メニュー例タブ */}
          {activeTab === 'menu' && (
            <div className="space-y-4 sm:space-y-6">
              {data.menu_examples && data.menu_examples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {data.menu_examples.map((menu, index) => (
                    <div key={index} className="card hover:scale-105 transition-transform duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 flex-1">{menu.name}</h4>
                        <span className="text-lg sm:text-xl font-bold text-blue-600 ml-2">¥{menu.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{menu.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-gray-600">メニュー例のデータがありません</p>
                </div>
              )}
            </div>
          )}

          {/* 集客・オペレーション戦略タブ */}
          {activeTab === 'strategy' && (
            <div className="space-y-4 sm:space-y-6">
              {data.sns_strategy && (
                <div className="card">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">📱</span>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">SNS戦略</h3>
                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{data.sns_strategy}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {data.staff_count && (
                  <div className="card">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">👨‍💼</span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">スタッフ人数</h3>
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600">{data.staff_count}人</p>
                    <p className="text-sm text-gray-600 mt-2">推奨人数</p>
                  </div>
                )}

                {data.peak_operation && (
                  <div className="card">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">⏰</span>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">ピークタイムオペレーション</h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{data.peak_operation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 収支予測と初期投資タブ */}
          {activeTab === 'financial' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="card">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">月次収支予測</h3>
                <div className="bg-white rounded-xl overflow-hidden border border-blue-100">
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100 bg-blue-50/50">
                    <span className="font-semibold text-gray-800">売上高</span>
                    <span className="text-lg sm:text-xl font-bold text-blue-700">¥{data.monthly_sales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100">
                    <span className="text-gray-700">原価（{Math.round(data.cogs_rate * 100)}%）</span>
                    <span className="font-semibold text-gray-800">-¥{data.cogs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100 bg-blue-50/30">
                    <span className="font-semibold text-gray-800">粗利益</span>
                    <span className="text-lg font-bold text-blue-600">¥{data.gross_profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100">
                    <span className="text-gray-700">人件費（28%）</span>
                    <span className="font-semibold text-gray-800">-¥{data.labor_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b border-blue-100">
                    <span className="text-gray-700">固定費</span>
                    <span className="font-semibold text-gray-800">-¥{data.fixed_cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <span className="font-bold text-lg">営業利益</span>
                    <span className="font-bold text-xl">{data.op_income >= 0 ? '+' : ''}¥{data.op_income.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {data.initial_investment && (
                  <div className="card">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">初期設備費</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">¥{data.initial_investment.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">内装・設備・備品など</p>
                  </div>
                )}

                {data.opening_cost && (
                  <div className="card">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">開業費（概算）</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">¥{data.opening_cost.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">初期投資 + 運転資金</p>
                  </div>
                )}
              </div>

              {data.funding_methods && data.funding_methods.length > 0 && (
                <div className="card">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">資金調達方法</h3>
                  <div className="space-y-3">
                    {data.funding_methods.map((method, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">💰</span>
                          <span className="font-semibold text-gray-800">{method}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <a
                      href="https://www.smrj.go.jp/hakusyo/hakusyo.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                    >
                      <span>補助金・助成金の詳細を見る</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📅</span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">回収期間</h3>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-700">{data.payback_months}ヶ月</p>
                <p className="text-sm text-gray-600 mt-2">初期投資の回収目安</p>
              </div>
            </div>
          )}
        </div>

        {/* ユーザー登録への誘導 */}
        <div className="mt-8 sm:mt-12 card bg-gradient-to-br from-blue-600 to-blue-800 text-white border-0 shadow-xl">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">詳細シミュレーションに進む</h3>
            <p className="text-sm sm:text-base mb-6 opacity-90 leading-relaxed">
              より詳細な分析や複数プランの比較、保存機能をご利用いただくには<br className="hidden sm:block" />
              ユーザー登録が必要です（無料）
            </p>
            <Link 
              href="/signup"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ユーザー登録（無料）
            </Link>
            <p className="text-xs sm:text-sm mt-4 opacity-75">
              ※ 登録なしでも現在の結果は閲覧できます
            </p>
          </div>
        </div>

        {/* 最初からやり直すボタン */}
        <div className="mt-6 text-center">
          <button
            onClick={onRestart}
            className="btn-secondary max-w-md mx-auto"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  );
}
