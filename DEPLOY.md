# デプロイガイド

チームでアプリを共有するための簡単なデプロイ方法です。フロントエンドとバックエンドを分けてデプロイできます。

## 推奨デプロイ方法

### フロントエンド: Vercel（無料・簡単）
### バックエンド: Railway または Render（無料プランあり）

---

## 方法1: Vercel + Railway（推奨）

### ステップ1: バックエンドをRailwayにデプロイ

1. **Railwayアカウント作成**
   - https://railway.app/ にアクセス
   - GitHubアカウントでサインアップ（無料）

2. **新しいプロジェクトを作成**
   - "New Project" → "Deploy from GitHub repo"
   - このリポジトリを選択

3. **サービスを追加**
   - "New" → "GitHub Repo" → `backend`フォルダを選択
   - または、プロジェクトルートから`backend`フォルダを指定

4. **環境変数を設定**
   - Railwayのダッシュボードで "Variables" タブを開く
   - 以下を追加：
     ```
     DATABASE_URL=sqlite:///./omise_ai.db
     FRONTEND_URL=https://your-frontend.vercel.app
     PORT=8000
     ```

5. **ビルドコマンドを設定**
   - Settings → "Build Command" は空欄のまま
   - "Start Command": `uvicorn main:app --host 0.0.0.0 --port $PORT`

6. **デプロイ**
   - Railwayが自動的にデプロイを開始
   - デプロイ完了後、URLをコピー（例: `https://your-backend.railway.app`）

### ステップ2: フロントエンドをVercelにデプロイ

1. **Vercelアカウント作成**
   - https://vercel.com/ にアクセス
   - GitHubアカウントでサインアップ（無料）

2. **プロジェクトをインポート**
   - "Add New" → "Project" → このリポジトリを選択
   - "Root Directory" を `frontend` に設定

3. **環境変数を設定**
   - "Environment Variables" で以下を追加：
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```

4. **デプロイ**
   - "Deploy" をクリック
   - 数分でデプロイ完了
   - URLをコピー（例: `https://your-app.vercel.app`）

5. **バックエンドのFRONTEND_URLを更新**
   - Railwayの環境変数で `FRONTEND_URL` をVercelのURLに更新

---

## 方法2: Vercel + Render（代替案）

### バックエンドをRenderにデプロイ

1. **Renderアカウント作成**
   - https://render.com/ にアクセス
   - GitHubアカウントでサインアップ（無料）

2. **新しいWebサービスを作成**
   - "New" → "Web Service"
   - このリポジトリを選択
   - "Root Directory" を `backend` に設定

3. **設定**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **環境変数を設定**
   ```
   DATABASE_URL=sqlite:///./omise_ai.db
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **デプロイ**
   - "Create Web Service" をクリック
   - デプロイ完了後、URLをコピー

### フロントエンドは方法1と同じ（Vercel）

---

## 方法3: 両方ともRenderにデプロイ

### バックエンド（Web Service）
- 上記の「方法2」と同じ手順

### フロントエンド（Static Site）
1. Renderで "New" → "Static Site"
2. リポジトリを選択、Root Directory を `frontend` に設定
3. Build Command: `npm install && npm run build`
4. Publish Directory: `.next`
5. 環境変数: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

---

## デプロイ後の確認

### バックエンド
- `https://your-backend-url/health` にアクセス
- `{"status": "healthy"}` が返ってくればOK

### フロントエンド
- デプロイされたURLにアクセス
- ブラウザの開発者ツール（F12）でエラーがないか確認

---

## トラブルシューティング

### CORSエラー
- バックエンドの `FRONTEND_URL` が正しく設定されているか確認
- `config.py` の `allow_origins` にフロントエンドのURLが含まれているか確認

### 環境変数が反映されない
- デプロイ後に環境変数を変更した場合、再デプロイが必要
- Vercel: 自動的に再デプロイ
- Railway/Render: 手動で再デプロイが必要な場合あり

### データベースエラー
- SQLiteはファイルベースなので、Railway/Renderでは永続化されない可能性あり
- 本格運用時はPostgreSQLやMySQLを使用することを推奨

---

## 無料プランの制限

### Vercel
- 無制限のデプロイ
- 帯域幅: 100GB/月
- 十分な機能

### Railway
- $5の無料クレジット/月
- 小規模なアプリなら十分

### Render
- 無料プランは15分の非アクティブ後にスリープ
- 初回アクセス時に起動に時間がかかる場合あり

---

## 次のステップ（本格運用時）

1. **データベースをPostgreSQLに変更**
   - Railway/RenderでPostgreSQLサービスを追加
   - `DATABASE_URL`を更新

2. **カスタムドメインを設定**
   - Vercel/Railway/Renderでカスタムドメインを設定可能

3. **CI/CDの設定**
   - GitHubにpushするだけで自動デプロイ




