# ローカルMySQLセットアップガイド

Dockerを使わずにローカルMySQLを使用する方法です。

## 前提条件

- MySQLがインストールされていること
- MySQLサーバーが起動していること

## セットアップ手順

### 1. MySQLのインストール（未インストールの場合）

1. MySQL公式サイトからインストーラーをダウンロード:
   https://dev.mysql.com/downloads/installer/

2. 「MySQL Installer for Windows」をダウンロードしてインストール

3. インストール時に以下を設定:
   - Rootパスワード: `password`（または任意のパスワード）
   - ポート: `3306`（デフォルト）

### 2. MySQLサーバーの起動確認

PowerShellで以下を実行:

```powershell
# MySQLサービスが起動しているか確認
Get-Service -Name MySQL* | Select-Object Name, Status
```

起動していない場合は:

```powershell
# MySQLサービスを起動（サービス名は環境によって異なる場合があります）
Start-Service MySQL80
# または
net start MySQL80
```

### 3. データベースの作成

MySQLに接続してデータベースを作成:

```powershell
# MySQLに接続（パスワードを求められます）
mysql -u root -p
```

MySQLプロンプトで以下を実行:

```sql
CREATE DATABASE omise_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. .envファイルの確認

`backend/.env`ファイルが以下のようになっているか確認:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/omise_ai?charset=utf8mb4
FRONTEND_URL=http://localhost:3000
```

**注意**: `password`の部分を、MySQLのrootパスワードに変更してください。

### 5. バックエンドの起動

```powershell
cd backend
python main.py
```

正常に起動すれば、`http://localhost:8000`でAPIが利用可能になります。




