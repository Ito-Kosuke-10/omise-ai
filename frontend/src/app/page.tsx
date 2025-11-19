'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import TypeSelector from '@/components/TypeSelector';
import BusinessForm from '@/components/BusinessForm';
import ResultDisplay from '@/components/ResultDisplay';
import { BusinessPlanOutput } from '@/lib/api';

type Screen = 'hero' | 'type' | 'form' | 'result';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('hero');
  const [selectedType, setSelectedType] = useState<string>('');
  const [result, setResult] = useState<BusinessPlanOutput | null>(null);

  const handleNext = () => {
    if (currentScreen === 'hero') setCurrentScreen('type');
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCurrentScreen('form');
  };

  const handleFormSubmit = (data: BusinessPlanOutput) => {
    setResult(data);
    setCurrentScreen('result');
  };

  const handleRestart = () => {
    setCurrentScreen('hero');
    setSelectedType('');
    setResult(null);
  };

  return (
    <main className="min-h-screen">
      {currentScreen === 'hero' && <Hero onNext={handleNext} />}
      {currentScreen === 'type' && <TypeSelector onSelect={handleTypeSelect} />}
      {currentScreen === 'form' && <BusinessForm type={selectedType} onSubmit={handleFormSubmit} />}
      {currentScreen === 'result' && result && <ResultDisplay data={result} onRestart={handleRestart} />}
    </main>
  );
}



