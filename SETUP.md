# ローカル開発環境セットアップガイド

## 前提条件

- Python 3.11以上
- Node.js 18以上
- Docker Desktop（MySQLを使用する場合）

## セットアップ手順

### 1. データベースのセットアップ

#### オプションA: Dockerを使用（推奨）

1. Docker Desktopを起動
2. プロジェクトルートで以下を実行:
```bash
docker-compose up -d
```

これでMySQLコンテナが起動し、以下の設定でデータベースが作成されます:
- ホスト: localhost:3306
- データベース名: omise_ai
- ユーザー名: root
- パスワード: password

#### オプションB: ローカルMySQLを使用

1. MySQLをインストール
2. MySQLに接続してデータベースを作成:
```sql
CREATE DATABASE omise_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. `backend/.env` ファイルで接続情報を設定

### 2. バックエンドの起動

```bash
cd backend
python main.py
```

または

```bash
cd backend
uvicorn main:app --reload
```

バックエンドは `http://localhost:8000` で起動します。

APIドキュメントは `http://localhost:8000/docs` で確認できます。

### 3. フロントエンドの起動

新しいターミナルで:

```bash
cd frontend
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

### 4. データベーステーブルの作成

バックエンドを起動すると、`main.py` の `models.Base.metadata.create_all(bind=engine)` により自動的にテーブルが作成されます。

手動で作成する場合:

```bash
cd backend
python create_database.py
```

## トラブルシューティング

### データベース接続エラー

- MySQLサーバーが起動しているか確認
- `backend/.env` の `DATABASE_URL` が正しいか確認
- ファイアウォールでポート3306がブロックされていないか確認

### ポートが既に使用されている

- バックエンド: ポート8000が使用中の場合は、`main.py` のポート番号を変更
- フロントエンド: ポート3000が使用中の場合は、`npm run dev -- -p 3001` などで別のポートを指定
- MySQL: ポート3306が使用中の場合は、`docker-compose.yml` のポートマッピングを変更

### CORSエラー

`backend/config.py` の `FRONTEND_URL` が正しく設定されているか確認してください。

## 開発の流れ

1. Docker ComposeでMySQLを起動: `docker-compose up -d`
2. バックエンドを起動: `cd backend && python main.py`
3. フロントエンドを起動: `cd frontend && npm run dev`
4. ブラウザで `http://localhost:3000` を開く

## 停止方法

- MySQLコンテナを停止: `docker-compose down`
- データも削除する場合: `docker-compose down -v`






