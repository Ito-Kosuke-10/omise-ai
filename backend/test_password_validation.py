"""
パスワードバリデーションのテストコード

実行方法:
    python test_password_validation.py
"""

import sys
from pathlib import Path

# backendディレクトリをパスに追加
backend_dir = Path(__file__).parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from auth.password import hash_password, verify_password

def test_password_validation():
    """パスワードバリデーションのテスト"""
    
    print("=" * 60)
    print("パスワードバリデーションテスト")
    print("=" * 60)
    
    # テストケース1: 正常な8文字のパスワード（"testtest"）
    print("\n[テスト1] 8文字のパスワード（testtest）")
    try:
        password = "testtest"
        hashed = hash_password(password)
        print(f"✓ 成功: パスワード '{password}' は正常にハッシュ化されました")
        print(f"  ハッシュ: {hashed[:50]}...")
        
        # 検証もテスト
        if verify_password(password, hashed):
            print(f"✓ 検証成功: パスワードの検証も正常に動作しました")
        else:
            print(f"✗ 検証失敗: パスワードの検証に失敗しました")
    except Exception as e:
        print(f"✗ エラー: {e}")
    
    # テストケース2: 72文字のパスワード（英数字のみ、72バイト）
    print("\n[テスト2] 72文字のパスワード（英数字のみ）")
    try:
        password = "a" * 72
        hashed = hash_password(password)
        print(f"✓ 成功: 72文字のパスワードは正常にハッシュ化されました")
    except Exception as e:
        print(f"✗ エラー: {e}")
    
    # テストケース3: 73文字のパスワード（72バイトを超える）
    print("\n[テスト3] 73文字のパスワード（72バイトを超える）")
    try:
        password = "a" * 73
        hashed = hash_password(password)
        print(f"✗ 失敗: 73文字のパスワードがハッシュ化されてしまいました（エラーになるべき）")
    except ValueError as e:
        print(f"✓ 成功: 期待通りエラーが発生しました")
        print(f"  エラーメッセージ: {e}")
    except Exception as e:
        print(f"✗ 予期しないエラー: {e}")
    
    # テストケース4: 日本語を含むパスワード（24文字 = 72バイト）
    print("\n[テスト4] 日本語を含むパスワード（24文字 = 72バイト）")
    try:
        password = "あ" * 24  # UTF-8で1文字3バイト、24文字 = 72バイト
        hashed = hash_password(password)
        print(f"✓ 成功: 24文字の日本語パスワードは正常にハッシュ化されました")
    except Exception as e:
        print(f"✗ エラー: {e}")
    
    # テストケース5: 日本語を含むパスワード（25文字 = 75バイト、72バイトを超える）
    print("\n[テスト5] 日本語を含むパスワード（25文字 = 75バイト、72バイトを超える）")
    try:
        password = "あ" * 25  # UTF-8で1文字3バイト、25文字 = 75バイト
        hashed = hash_password(password)
        print(f"✗ 失敗: 25文字の日本語パスワードがハッシュ化されてしまいました（エラーになるべき）")
    except ValueError as e:
        print(f"✓ 成功: 期待通りエラーが発生しました")
        print(f"  エラーメッセージ: {e}")
    except Exception as e:
        print(f"✗ 予期しないエラー: {e}")
    
    # テストケース6: 混在パスワード（英数字 + 日本語）
    print("\n[テスト6] 混在パスワード（英数字 + 日本語）")
    try:
        password = "testあ" * 18  # "testあ" = 5文字 = 7バイト、18回 = 90文字 = 126バイト（超える）
        password_bytes = password.encode("utf-8")
        print(f"  パスワード長: {len(password)}文字, バイト長: {len(password_bytes)}バイト")
        hashed = hash_password(password)
        print(f"✗ 失敗: 72バイトを超えるパスワードがハッシュ化されてしまいました（エラーになるべき）")
    except ValueError as e:
        print(f"✓ 成功: 期待通りエラーが発生しました")
        print(f"  エラーメッセージ: {e}")
    except Exception as e:
        print(f"✗ 予期しないエラー: {e}")
    
    print("\n" + "=" * 60)
    print("テスト完了")
    print("=" * 60)

if __name__ == "__main__":
    test_password_validation()

