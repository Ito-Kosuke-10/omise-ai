# クイックスタートガイド

## ステップ1: バックエンドの環境変数ファイルを作成

`backend/.env` ファイルを以下の内容で作成してください：

### Docker Composeを使用する場合（推奨）

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/omise_ai?charset=utf8mb4
FRONTEND_URL=http://localhost:3000
```

### ローカルMySQLを使用する場合

```env
DATABASE_URL=mysql+pymysql://root:あなたのパスワード@localhost:3306/omise_ai?charset=utf8mb4
FRONTEND_URL=http://localhost:3000
```

## ステップ2: MySQLを起動

### オプションA: Docker Composeを使用（推奨）

1. Docker Desktopをインストール: https://www.docker.com/products/docker-desktop/
2. インストール後、プロジェクトルートで実行:
```bash
docker-compose up -d
```

### オプションB: ローカルMySQLを使用

1. MySQLがインストールされていることを確認
2. MySQLに接続してデータベースを作成:
```sql
CREATE DATABASE omise_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## ステップ3: バックエンドを起動

新しいターミナルで:

```bash
cd backend
python main.py
```

バックエンドは `http://localhost:8000` で起動します。

## ステップ4: フロントエンドを起動

別の新しいターミナルで:

```bash
cd frontend
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

## ステップ5: ブラウザで開く

`http://localhost:3000` を開いてアプリケーションを使用してください。

## トラブルシューティング

### データベース接続エラー

- MySQLサーバーが起動しているか確認
- `backend/.env` の `DATABASE_URL` が正しいか確認
- Dockerを使用している場合: `docker-compose ps` でコンテナが起動しているか確認

### ポートが使用中

- バックエンド（8000）: 他のプロセスが使用していないか確認
- フロントエンド（3000）: `npm run dev -- -p 3001` で別のポートを使用
- MySQL（3306）: `docker-compose.yml` のポート番号を変更






