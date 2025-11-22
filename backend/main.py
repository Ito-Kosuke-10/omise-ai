from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import models, schemas, crud
from database import engine, get_db
from config import settings
from auth.jwt import create_access_token
from auth.dependencies import get_current_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="おみせ開業AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "https://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "おみせ開業AI API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/plans", response_model=schemas.BusinessPlanOutput)
def create_plan(plan: schemas.BusinessPlanInput, db: Session = Depends(get_db)):
    try:
        # 入力データの検証
        if not plan.type or not plan.area:
            raise HTTPException(status_code=400, detail="業態と立地は必須です")
        
        if plan.seats <= 0 or plan.atv <= 0:
            raise HTTPException(status_code=400, detail="席数と客単価は1以上である必要があります")
        
        db_plan = crud.create_business_plan(db, plan)
        calc = crud.calculate_business_plan(plan)
        
        # 拡張フィールドを追加（Noneチェック付き）
        from datetime import datetime
        
        # menu_examplesの処理
        menu_examples_list = []
        if calc.get('menu_examples'):
            try:
                menu_examples_list = [schemas.MenuExample(**m) for m in calc.get('menu_examples', []) if m]
            except Exception as e:
                print(f"Warning: Error processing menu_examples: {e}")
                menu_examples_list = []
        
        result = schemas.BusinessPlanOutput(
            id=db_plan.id,
            type=db_plan.type,
            seats=db_plan.seats,
            atv=db_plan.atv,
            hours=db_plan.hours,
            area=db_plan.area,
            turnover=db_plan.turnover,
            daily_guests=db_plan.daily_guests,
            monthly_sales=db_plan.monthly_sales,
            cogs_rate=db_plan.cogs_rate,
            cogs=db_plan.cogs,
            gross_profit=db_plan.gross_profit,
            labor_cost=db_plan.labor_cost,
            fixed_cost=db_plan.fixed_cost,
            op_income=db_plan.op_income,
            payback_months=db_plan.payback_months,
            concept=db_plan.concept or "",
            action=db_plan.action or "",
            catch_copy=calc.get('catch_copy'),
            target_audience=calc.get('target_audience'),
            menu_examples=menu_examples_list if menu_examples_list else None,
            sns_strategy=calc.get('sns_strategy'),
            staff_count=calc.get('staff_count'),
            peak_operation=calc.get('peak_operation'),
            initial_investment=calc.get('initial_investment'),
            opening_cost=calc.get('opening_cost'),
            funding_methods=calc.get('funding_methods'),
            seat_occupancy_rate=calc.get('seat_occupancy_rate'),
            created_at=db_plan.created_at if db_plan.created_at else datetime.now()
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback_str = traceback.format_exc()
        print(f"Error creating plan: {error_msg}")
        print(traceback_str)
        raise HTTPException(status_code=500, detail=f"プラン作成中にエラーが発生しました: {error_msg}")

@app.get("/api/plans/{plan_id}", response_model=schemas.BusinessPlanOutput)
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    db_plan = crud.get_business_plan(db, plan_id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return db_plan

@app.get("/api/plans", response_model=List[schemas.BusinessPlanOutput])
def get_plans(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_business_plans(db, skip, limit)

@app.get("/api/menus/{type}/{concept}")
def get_menus(type: str, concept: str):
    suggestions = crud.get_menu_suggestions(type, concept)
    return {"suggestions": suggestions}

@app.get("/api/subsidies/{area}")
def get_subsidies(area: str):
    subsidies = [
        {
            "name": "小規模事業者持続化補助金",
            "amount": "上限：50万円（条件により200万円）",
            "detail": "販路開拓・生産性向上の取り組みを支援。",
            "requirement": "従業員5人以下の小規模事業者",
            "badge": "募集中"
        },
        {
            "name": "IT導入補助金",
            "amount": "上限：50～450万円",
            "detail": "POSレジ、予約システム、会計ソフトなどのITツール導入費用を補助。",
            "requirement": "中小企業・小規模事業者",
            "badge": None
        }
    ]
    
    if area == "観光地":
        local = {
            "name": "観光振興・商店街活性化補助金",
            "amount": "上限：50～300万円",
            "detail": "観光地での新規出店を支援。",
            "requirement": "観光地での新規創業者",
            "badge": "地域限定"
        }
    elif area == "駅近":
        local = {
            "name": "駅前活性化・創業支援補助金",
            "amount": "上限：50～300万円",
            "detail": "駅前エリアの活性化を目的とした創業支援。",
            "requirement": "駅前での新規創業者",
            "badge": "地域限定"
        }
    else:
        local = {
            "name": "地方自治体の創業支援補助金",
            "amount": "上限：50～300万円",
            "detail": "開業時の設備投資、広告宣伝費などを支援。",
            "requirement": "新規創業者",
            "badge": "地域限定"
        }
    
    subsidies.append(local)
    return {"subsidies": subsidies}


# 認証関連のエンドポイント
@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """ユーザー登録"""
    try:
        # ユーザーを作成
        db_user = crud.create_user(db, user_data)
        
        # JWTトークンを発行
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email},
            expires_delta=timedelta(seconds=settings.jwt_expires_in)
        )
        
        # レスポンスを返す
        return schemas.TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=schemas.UserResponse(
                id=db_user.id,
                email=db_user.email,
                created_at=db_user.created_at
            )
        )
    except ValueError as e:
        # ValueErrorはバリデーションエラーとして400で返す
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        # HTTPExceptionはそのまま再発生
        raise
    except Exception as e:
        # その他の予期しないエラーは500で返す（ライブラリの生エラーを隠す）
        error_msg = str(e)
        # bcrypt関連のエラーメッセージをチェック
        if "72 bytes" in error_msg.lower() or "too long" in error_msg.lower():
            raise HTTPException(
                status_code=400,
                detail="パスワードは72バイト以内で入力してください。（英数字のみの場合は72文字以内、日本語などのマルチバイト文字を含む場合は文字数が少なくなります）"
            )
        # その他のエラーは汎用的なメッセージに変換
        import traceback
        print(f"Unexpected error in register: {error_msg}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="ユーザー登録中にエラーが発生しました。しばらく待ってから再度お試しください。")


@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """ユーザーログイン"""
    # ユーザー認証
    user = crud.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # JWTトークンを発行
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(seconds=settings.jwt_expires_in)
    )
    
    # レスポンスを返す
    return schemas.TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=schemas.UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at
        )
    )


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user = Depends(get_current_user)):
    """現在のユーザー情報を取得"""
    return schemas.UserResponse(
        id=current_user.id,
        email=current_user.email,
        created_at=current_user.created_at
    )


@app.get("/api/plans/my", response_model=List[schemas.BusinessPlanOutput])
def get_my_plans(
    skip: int = 0,
    limit: int = 10,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """ログインユーザーのシミュレーション結果一覧を取得（下準備）"""
    # 現在は全ユーザーのプランを返すが、将来的にuser_idでフィルタリングする
    # current_user.id を使ってフィルタリングできるように準備
    return crud.get_business_plans(db, skip, limit)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


