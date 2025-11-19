'use client';
import { useState, useEffect } from 'react';
import categoriesData from '@/data/categories.json';

interface TypeSelectorProps {
  onSelect: (type: string) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export default function TypeSelector({ onSelect }: TypeSelectorProps) {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const categories: Category[] = categoriesData.categories;

  // メインカテゴリ変更時にサブカテゴリをリセット
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedMainCategory]);

  const handleMainCategorySelect = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    const mainCategory = categories.find(cat => cat.id === selectedMainCategory);
    if (mainCategory) {
      // メインカテゴリ名とサブカテゴリ名を組み合わせて送信
      onSelect(`${mainCategory.name} - ${subCategory}`);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedMainCategory);

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 py-12 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
              開業したい業態を選択
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {selectedMainCategory 
              ? '詳細な業態を選択してください' 
              : 'メインカテゴリを選択してください'}
          </p>
        </div>

        {/* メインカテゴリ選択 */}
        {!selectedMainCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMainCategorySelect(category.id)}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border-2 border-blue-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 text-center leading-tight">
                    {category.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        ) : (
          /* サブカテゴリ選択 */
          <div className="space-y-6">
            {/* 選択中のメインカテゴリ表示 */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setSelectedMainCategory(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-blue-200 hover:bg-blue-50 transition-all duration-300 text-sm font-medium text-blue-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                戻る
              </button>
              <div className="flex items-center gap-3 px-6 py-3 bg-blue-100/80 backdrop-blur-sm rounded-xl border border-blue-200">
                <span className="text-2xl">{selectedCategory?.icon}</span>
                <span className="text-lg font-bold text-blue-700">{selectedCategory?.name}</span>
              </div>
            </div>

            {/* サブカテゴリグリッド */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {selectedCategory?.subcategories.map((subCategory) => (
                <button
                  key={subCategory}
                  onClick={() => handleSubCategorySelect(subCategory)}
                  className={`group relative bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border-2 transition-all duration-300 hover:scale-105 ${
                    selectedSubCategory === subCategory
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-blue-100 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <span className={`text-sm sm:text-base font-semibold ${
                    selectedSubCategory === subCategory
                      ? 'text-blue-700'
                      : 'text-gray-800'
                  }`}>
                    {subCategory}
                  </span>
                  {selectedSubCategory === subCategory && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



