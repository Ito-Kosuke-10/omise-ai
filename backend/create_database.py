"""
データベースが存在しない場合に作成するスクリプト
MySQLサーバーが起動している必要があります
"""
import pymysql
from config import settings

# DATABASE_URLから接続情報を抽出
# 例: mysql+pymysql://root:password@localhost:3306/omise_ai?charset=utf8mb4
import re

url_pattern = r'mysql\+pymysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)'
match = re.match(url_pattern, settings.database_url)

if match:
    username, password, host, port, database = match.groups()
    
    try:
        # データベース名を除いて接続（データベースが存在しない可能性があるため）
        connection = pymysql.connect(
            host=host,
            port=int(port),
            user=username,
            password=password,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # データベースが存在しない場合は作成
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ データベース '{database}' の作成に成功しました（既に存在する場合はスキップされました）")
        
        connection.close()
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        print("\nデータベースサーバーが起動しているか確認してください。")
        print("Dockerを使用する場合: docker-compose up -d")
else:
    print("❌ DATABASE_URLの形式が正しくありません")






