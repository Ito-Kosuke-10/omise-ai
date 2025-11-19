import './globals.css'

export const metadata = {
  title: 'おみせ開業AI',
  description: '質問に答えるだけで、初期のコンセプト、簡易PL、集客・オペ戦略、そして今日の一歩を自動生成',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
