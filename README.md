# おみせ開業AI

飲食店開業を支援するAIアプリケーション。質問に答えるだけで、初期のコンセプト、簡易PL、集客・オペ戦略、そして今日の一歩を自動生成します。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **バックエンド**: FastAPI, SQLAlchemy, pymysql
- **データベース**: MySQL (ローカル開発用), Azure Database for MySQL (本番用)

## プロジェクト構成

```
omise-ai/
├── frontend/          # Next.js アプリ
│   ├── src/
│   │   ├── app/       # App Router ページ
│   │   ├── components/ # React コンポーネント
│   │   └── lib/       # API クライアント
│   └── public/        # 静的ファイル
├── backend/           # FastAPI アプリ
│   ├── main.py        # FastAPI アプリケーション
│   ├── database.py    # データベース接続
│   ├── models.py      # SQLAlchemy モデル
│   ├── schemas.py     # Pydantic スキーマ
│   ├── crud.py        # ビジネスロジック
│   └── config.py      # 設定管理
└── README.md
```

## セットアップ

### バックエンド

1. バックエンドディレクトリに移動:
```bash
cd backend
```

2. 仮想環境を作成（推奨）:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. 依存関係をインストール:
```bash
pip install -r requirements.txt
```

4. 環境変数を設定:
```bash
cp .env.example .env
# .env ファイルを編集してデータベース接続情報を設定
```

5. データベースを作成:
```sql
CREATE DATABASE omise_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. サーバーを起動:
```bash
python main.py
# または
uvicorn main:app --reload
```

### フロントエンド

1. フロントエンドディレクトリに移動:
```bash
cd frontend
```

2. 依存関係をインストール:
```bash
npm install
```

3. 環境変数を設定:
```bash
# .env.local ファイルを作成
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. 開発サーバーを起動:
```bash
npm run dev
```

## 使用方法

1. ブラウザで `http://localhost:3000` を開く
2. 「はじめる」ボタンをクリック
3. 開業したい業態を選択
4. 基本情報（席数、客単価、営業時間、立地）を入力
5. 計算結果を確認
6. メニュー提案や補助金情報を確認

## API エンドポイント

- `GET /` - API ステータス確認
- `GET /health` - ヘルスチェック
- `POST /api/plans` - ビジネスプラン作成
- `GET /api/plans/{plan_id}` - プラン取得
- `GET /api/plans` - プラン一覧取得
- `GET /api/menus/{type}/{concept}` - メニュー提案取得
- `GET /api/subsidies/{area}` - 補助金情報取得

## デプロイ

### Azure Database for MySQL への接続

`.env` ファイルで Azure Database for MySQL の接続文字列を設定:

```
DATABASE_URL=mysql+pymysql://<username>:<password>@<server-name>.mysql.database.azure.com:3306/<database-name>?charset=utf8mb4&ssl_ca=/path/to/cert.pem
```

### 本番環境

- フロントエンド: Vercel や Azure Static Web Apps にデプロイ
- バックエンド: Azure App Service や Azure Container Instances にデプロイ

## ライセンス

MIT



