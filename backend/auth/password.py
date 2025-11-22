import bcrypt

# bcryptの72バイト制限
BCRYPT_MAX_BYTES = 72

def hash_password(password: str) -> str:
    """パスワードをハッシュ化（bcryptを直接使用）"""
    # パスワードのバイト長をチェック
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > BCRYPT_MAX_BYTES:
        raise ValueError(
            f"パスワードは72バイト以内で入力してください。"
            f"（英数字のみの場合は72文字以内、日本語などのマルチバイト文字を含む場合は文字数が少なくなります）"
        )
    
    try:
        # bcryptを直接使用（passlibを使わない）
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        return hashed.decode("utf-8")
    except Exception as e:
        # 予期しないエラーを捕捉
        error_msg = str(e)
        if "72 bytes" in error_msg.lower() or "too long" in error_msg.lower():
            raise ValueError(
                "パスワードは72バイト以内で入力してください。"
                "（英数字のみの場合は72文字以内、日本語などのマルチバイト文字を含む場合は文字数が少なくなります）"
            )
        # その他のエラーは汎用的なメッセージに変換
        raise ValueError("パスワードのハッシュ化中にエラーが発生しました。別のパスワードをお試しください。")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """パスワードを検証（bcryptを直接使用）"""
    try:
        # bcryptを直接使用（passlibを使わない）
        plain_bytes = plain_password.encode("utf-8")
        hashed_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception as e:
        # 検証時のエラーも捕捉（通常は発生しないが、念のため）
        error_msg = str(e)
        if "72 bytes" in error_msg.lower() or "too long" in error_msg.lower():
            raise ValueError("パスワードが長すぎます。72バイト以内で入力してください。")
        return False

