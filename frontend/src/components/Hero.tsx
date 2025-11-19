interface HeroProps {
  onNext: () => void;
}

export default function Hero({ onNext }: HeroProps) {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 py-12 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 背景装飾 - より明確なBlue */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        {/* バッジ */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-100 rounded-full border border-blue-200 shadow-sm">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-blue-700">AI パワード</span>
        </div>

        {/* メインタイトル - より明確なBlue */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            おみせ開業AI
          </span>
        </h1>

        {/* サブタイトル */}
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-4 font-semibold">
          あなたの夢を、<span className="text-blue-600">ビジネスプラン</span>に
        </p>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
          質問に答えるだけで、初期のコンセプト、簡易PL、集客・オペ戦略、そして今日の一歩を自動生成
        </p>

        {/* CTAボタン */}
        <div className="mb-16 px-4">
          <button 
            onClick={onNext} 
            className="btn-primary mx-auto group relative overflow-hidden inline-flex items-center justify-center gap-2"
          >
            <span>はじめる</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* 特徴アイコン - より明確な配置 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">自動生成</h3>
            <p className="text-sm text-gray-600">AIが最適なプランを提案</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">即座に結果</h3>
            <p className="text-sm text-gray-600">数分で完成するビジネスプラン</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">詳細分析</h3>
            <p className="text-sm text-gray-600">PL・集客戦略まで網羅</p>
          </div>
        </div>
      </div>
    </div>
  );
}



