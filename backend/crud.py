from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models, schemas
from auth.password import hash_password, verify_password

def extract_main_category(type: str) -> str:
    """「和食 - 寿司」のような形式からメインカテゴリを抽出"""
    if ' - ' in type:
        return type.split(' - ')[0]
    return type

def generate_concept(type: str, area: str) -> str:
    main_type = extract_main_category(type)
    concepts = {
        'カフェ': {
            '駅近': '通勤客が立ち寄りたくなる、香り高いコーヒーと焼き立てペストリーの朝カフェ',
            '住宅街': '地域のリビングルームとして、親子が集う居心地の良いコミュニティカフェ',
            'オフィス街': 'ランチ需要を捉える、本格コーヒーと軽食が充実したワークカフェ',
            '観光地': '旅の思い出になる、地元食材を使った特別なスイーツが人気のカフェ'
        },
        '焼鳥': {
            '駅近': 'サラリーマンが仕事帰りにサクッと一杯、気軽に立ち寄れる立ち飲み焼鳥',
            '住宅街': '家族連れも安心、座敷完備で地元に愛される炭火焼鳥専門店',
            'オフィス街': 'ランチは丼もの、夜は焼鳥で二毛作、効率重視の焼鳥ダイニング',
            '観光地': '地鶏にこだわった、観光客が行列する名物焼鳥店'
        },
        'ラーメン': {
            '駅近': '駅前立地を活かした、回転率重視の王道醤油ラーメン',
            '住宅街': 'ファミリー層も来店しやすい、優しい味わいの地域密着型ラーメン店',
            'オフィス街': 'ランチタイム一本勝負、濃厚スープで満足度の高い二郎系ラーメン',
            '観光地': 'ご当地食材を使った、SNS映えする創作ラーメンが人気の店'
        },
        '和食': {
            '駅近': '駅前立地を活かした、手軽に楽しめる本格和食',
            '住宅街': '家族で楽しめる、地域に愛される和食店',
            'オフィス街': 'ランチ需要を捉える、定食や丼ものが充実した和食店',
            '観光地': '地元の食材を活かした、観光客に人気の和食店'
        },
        '洋食': {
            '駅近': '駅前立地を活かした、気軽に楽しめる洋食店',
            '住宅街': '家族で楽しめる、本格的な洋食店',
            'オフィス街': 'ランチ需要を捉える、ビジネスパーソン向けの洋食店',
            '観光地': '観光客に人気の、特別感のある洋食店'
        },
        '中華': {
            '駅近': '駅前立地を活かした、手軽に楽しめる中華料理店',
            '住宅街': '家族で楽しめる、地域に愛される中華料理店',
            'オフィス街': 'ランチ需要を捉える、定食やランチメニューが充実した中華料理店',
            '観光地': '本格的な中華料理が楽しめる、観光客に人気の店'
        }
    }
    return concepts.get(main_type, {}).get(area, f'{area}の{main_type}として、地域に愛される、こだわりの味と心地よい空間を提供するお店')

def generate_action(type: str) -> str:
    main_type = extract_main_category(type)
    actions = {
        'カフェ': '看板メニュー1品を試作し、友人3人に味見してもらう',
        '焼鳥': '仕入れ候補の鶏肉卸3社に連絡し、見積もりを取る',
        'ラーメン': 'スープレシピを1つ完成させ、Instagramに投稿する',
        '和食': '看板メニュー1品を試作し、友人3人に味見してもらう',
        '洋食': '看板メニュー1品を試作し、友人3人に味見してもらう',
        '中華': '看板メニュー1品を試作し、友人3人に味見してもらう'
    }
    return actions.get(main_type, '看板商品1つを試作し、SNSで反応をチェックする')

def generate_catch_copy(type: str, area: str) -> str:
    main_type = extract_main_category(type)
    catch_copies = {
        'カフェ': {
            '駅近': '朝の一杯で、今日もいい1日を',
            '住宅街': '地域のリビングルーム、いつでもあなたの居場所',
            'オフィス街': '仕事の合間に、本格コーヒーでリフレッシュ',
            '観光地': '旅の思い出に、地元の味を'
        },
        '焼鳥': {
            '駅近': '仕事帰りに、サクッと一杯',
            '住宅街': '家族で楽しむ、本格炭火焼鳥',
            'オフィス街': 'ランチも夜も、焼鳥で二毛作',
            '観光地': '地鶏にこだわる、名物焼鳥店'
        },
        'ラーメン': {
            '駅近': '駅前の名物、濃厚スープの一杯',
            '住宅街': '地域に愛される、優しい味わい',
            'オフィス街': 'ランチタイム、満足の一杯',
            '観光地': 'ご当地食材で、SNS映えする一杯'
        },
        '和食': {
            '駅近': '駅前で、本格和食を',
            '住宅街': '家族で楽しむ、心温まる和食',
            'オフィス街': 'ランチタイム、満足の和食',
            '観光地': '地元の味、本格和食'
        },
        '洋食': {
            '駅近': '駅前で、本格洋食を',
            '住宅街': '家族で楽しむ、心温まる洋食',
            'オフィス街': 'ランチタイム、満足の洋食',
            '観光地': '特別な日、本格洋食'
        },
        '中華': {
            '駅近': '駅前で、本格中華を',
            '住宅街': '家族で楽しむ、心温まる中華',
            'オフィス街': 'ランチタイム、満足の中華',
            '観光地': '本格中華、観光客に人気'
        }
    }
    return catch_copies.get(main_type, {}).get(area, f'{area}で、{main_type}の新しいスタイルを')

def generate_target_audience(type: str, area: str) -> str:
    main_type = extract_main_category(type)
    audiences = {
        'カフェ': {
            '駅近': '通勤・通学客（20-40代）、朝のコーヒー需要',
            '住宅街': '主婦層、子育て世代、シニア層',
            'オフィス街': 'ビジネスパーソン、ランチ需要',
            '観光地': '観光客、地元住民、SNSユーザー'
        },
        '焼鳥': {
            '駅近': 'サラリーマン（30-50代）、仕事帰りの一杯',
            '住宅街': '家族連れ、地元住民、週末の集まり',
            'オフィス街': 'ビジネスパーソン、ランチ・飲み会需要',
            '観光地': '観光客、地元の常連客'
        },
        'ラーメン': {
            '駅近': '通勤客、学生、ランチ需要',
            '住宅街': '家族連れ、地元住民',
            'オフィス街': 'ビジネスパーソン、ランチ需要',
            '観光地': '観光客、ラーメン好き'
        },
        '和食': {
            '駅近': '通勤客、学生、ランチ需要',
            '住宅街': '家族連れ、地元住民',
            'オフィス街': 'ビジネスパーソン、ランチ需要',
            '観光地': '観光客、和食好き'
        },
        '洋食': {
            '駅近': '通勤客、学生、ランチ需要',
            '住宅街': '家族連れ、地元住民',
            'オフィス街': 'ビジネスパーソン、ランチ需要',
            '観光地': '観光客、洋食好き'
        },
        '中華': {
            '駅近': '通勤客、学生、ランチ需要',
            '住宅街': '家族連れ、地元住民',
            'オフィス街': 'ビジネスパーソン、ランチ需要',
            '観光地': '観光客、中華好き'
        }
    }
    return audiences.get(main_type, {}).get(area, '幅広い年齢層、地域住民')

def generate_menu_examples(type: str) -> list:
    main_type = extract_main_category(type)
    menus = {
        'カフェ': [
            {'name': 'スペシャルブレンドコーヒー', 'price': 480, 'description': '自家焙煎のこだわりブレンド'},
            {'name': '季節のフルーツタルト', 'price': 680, 'description': '旬のフルーツをたっぷり使用'},
            {'name': 'モーニングセット', 'price': 850, 'description': 'トースト・サラダ・ドリンク付き'}
        ],
        '焼鳥': [
            {'name': 'もも肉（塩）', 'price': 180, 'description': 'ジューシーなもも肉を塩でシンプルに'},
            {'name': 'ねぎま', 'price': 200, 'description': '定番のねぎま、タレで濃厚に'},
            {'name': 'つくね', 'price': 220, 'description': '手作りつくね、卵黄と一緒に'}
        ],
        'ラーメン': [
            {'name': '醤油ラーメン', 'price': 780, 'description': 'こだわりの醤油スープ'},
            {'name': '味玉ラーメン', 'price': 880, 'description': '味玉2個付き、ボリューム満点'},
            {'name': 'チャーシュー麺', 'price': 980, 'description': '厚切りチャーシュー3枚'}
        ],
        '和食': [
            {'name': '定食', 'price': 850, 'description': 'ご飯・味噌汁・おかず3品付き'},
            {'name': '丼もの', 'price': 680, 'description': 'ボリューム満点の丼もの'},
            {'name': 'お造り', 'price': 1200, 'description': '新鮮な魚介類の刺身'}
        ],
        '洋食': [
            {'name': 'ハンバーグ定食', 'price': 1200, 'description': '手作りハンバーグとサラダ'},
            {'name': 'オムライス', 'price': 980, 'description': 'ふわふわ卵のオムライス'},
            {'name': 'パスタ', 'price': 1100, 'description': '本格的なイタリアンパスタ'}
        ],
        '中華': [
            {'name': 'ラーメン', 'price': 780, 'description': 'こだわりのスープ'},
            {'name': '餃子', 'price': 480, 'description': '手作り餃子6個'},
            {'name': '麻婆豆腐定食', 'price': 850, 'description': '本格四川風麻婆豆腐'}
        ]
    }
    return menus.get(main_type, [
        {'name': 'おすすめメニュー1', 'price': 800, 'description': 'お店の特色を活かした一品'},
        {'name': 'おすすめメニュー2', 'price': 900, 'description': '人気の定番メニュー'},
        {'name': 'おすすめメニュー3', 'price': 1000, 'description': '特別な日のメニュー'}
    ])

def generate_sns_strategy(type: str, area: str) -> str:
    main_type = extract_main_category(type)
    strategies = {
        'カフェ': f'{area}でのカフェ開業では、Instagramでの写真投稿、Googleマップのレビュー獲得、地域SNSでの情報発信が効果的。特に朝のコーヒーやスイーツの写真はSNS映えしやすく、リピーター獲得に繋がります。',
        '焼鳥': f'{area}での焼鳥店では、炭火で焼く様子の動画投稿、メニュー写真、お酒とのペアリング情報をSNSで発信。特に夜の時間帯の投稿が集客に効果的です。',
        'ラーメン': f'{area}でのラーメン店では、スープの動画、トッピングの写真、食べ方のコツなどをSNSで発信。ランチタイムの混雑状況や待ち時間情報も共有すると良いでしょう。',
        '和食': f'{area}での和食店では、料理の美しい盛り付け写真、季節感のあるメニュー、伝統的な調理法の動画などをSNSで発信。特にランチタイムの情報発信が集客に効果的です。',
        '洋食': f'{area}での洋食店では、本格的な料理の写真、特別感のあるメニュー、店内の雰囲気などをSNSで発信。デートや特別な日の利用を意識した投稿が効果的です。',
        '中華': f'{area}での中華料理店では、ボリューム満点の料理写真、本格的な調理の様子、ランチメニューの情報などをSNSで発信。特にランチタイムの情報発信が集客に効果的です。'
    }
    return strategies.get(main_type, f'{area}での{main_type}店では、定期的なSNS投稿、Googleマップの最適化、口コミ獲得が重要です。')

def calculate_staff_count(seats: int, hours: str) -> int:
    # 簡易計算：席数と営業時間から必要スタッフ数を算出
    if seats <= 20:
        return 2
    elif seats <= 40:
        return 3
    else:
        return 4

def generate_peak_operation(type: str, hours: str) -> str:
    if '朝' in hours or '8' in hours or '9' in hours:
        return '朝のピークタイム（8:00-10:00）は、準備を前日から進め、スタッフを多めに配置。テイクアウト対応も並行して行うと効率的です。'
    elif 'ランチ' in hours or '11' in hours or '12' in hours or '13' in hours:
        return 'ランチタイム（11:30-14:00）は、事前準備を徹底し、回転率を上げるため簡易メニューも用意。スタッフを最大限配置します。'
    else:
        return '夜のピークタイム（18:00-21:00）は、接客と調理を効率化し、予約とウォークインのバランスを取ります。'

def calculate_initial_investment(seats: int, type: str) -> int:
    # 席数と業態から初期投資を算出（簡易版）
    main_type = extract_main_category(type)
    base_cost = 5000000  # 基本設備費
    seat_cost = seats * 50000  # 席数×5万円
    type_multiplier = {
        'カフェ': 1.0, 
        '焼鳥': 1.3, 
        'ラーメン': 1.1,
        '和食': 1.2,
        '洋食': 1.2,
        '中華': 1.1
    }.get(main_type, 1.0)
    return int((base_cost + seat_cost) * type_multiplier)

def calculate_opening_cost(initial_investment: int) -> int:
    # 開業費 = 初期投資 + 運転資金
    return initial_investment + 2000000  # 運転資金200万円

def get_funding_methods(area: str) -> list:
    methods = ['小規模事業者持続化補助金', 'IT導入補助金']
    if area == '観光地':
        methods.append('観光振興・商店街活性化補助金')
    elif area == '駅近':
        methods.append('駅前活性化・創業支援補助金')
    else:
        methods.append('地方自治体の創業支援補助金')
    return methods

def calculate_business_plan(input_data: schemas.BusinessPlanInput):
    main_type = extract_main_category(input_data.type)
    turnover = 2.0
    daily_guests = round(input_data.seats * turnover * 0.9)
    monthly_sales = input_data.atv * daily_guests * 30
    
    cogs_rates = {
        'カフェ': 0.28, 
        '焼鳥': 0.32, 
        'ラーメン': 0.30,
        '和食': 0.30,
        '洋食': 0.30,
        '中華': 0.30
    }
    cogs_rate = cogs_rates.get(main_type, 0.30)
    cogs = round(monthly_sales * cogs_rate)
    gross_profit = monthly_sales - cogs
    
    labor_cost = round(monthly_sales * 0.28)
    fixed_cost = 540000
    op_income = gross_profit - labor_cost - fixed_cost
    payback_months = 18 if op_income > 0 else 24
    
    concept = generate_concept(input_data.type, input_data.area)
    action = generate_action(input_data.type)
    
    # 拡張フィールド
    catch_copy = generate_catch_copy(input_data.type, input_data.area)
    target_audience = generate_target_audience(input_data.type, input_data.area)
    menu_examples = generate_menu_examples(input_data.type)
    sns_strategy = generate_sns_strategy(input_data.type, input_data.area)
    staff_count = calculate_staff_count(input_data.seats, input_data.hours)
    peak_operation = generate_peak_operation(input_data.type, input_data.hours)
    initial_investment = calculate_initial_investment(input_data.seats, input_data.type)
    opening_cost = calculate_opening_cost(initial_investment)
    funding_methods = get_funding_methods(input_data.area)
    seat_occupancy_rate = 0.75  # 座席稼働率75%
    
    return {
        'turnover': turnover,
        'daily_guests': daily_guests,
        'monthly_sales': monthly_sales,
        'cogs_rate': cogs_rate,
        'cogs': cogs,
        'gross_profit': gross_profit,
        'labor_cost': labor_cost,
        'fixed_cost': fixed_cost,
        'op_income': op_income,
        'payback_months': payback_months,
        'concept': concept,
        'action': action,
        'catch_copy': catch_copy,
        'target_audience': target_audience,
        'menu_examples': menu_examples,
        'sns_strategy': sns_strategy,
        'staff_count': staff_count,
        'peak_operation': peak_operation,
        'initial_investment': initial_investment,
        'opening_cost': opening_cost,
        'funding_methods': funding_methods,
        'seat_occupancy_rate': seat_occupancy_rate
    }

def create_business_plan(db: Session, input_data: schemas.BusinessPlanInput):
    calc = calculate_business_plan(input_data)
    
    # データベースに保存するフィールドのみを抽出（拡張フィールドは除外）
    db_fields = {
        'turnover': calc['turnover'],
        'daily_guests': calc['daily_guests'],
        'monthly_sales': calc['monthly_sales'],
        'cogs_rate': calc['cogs_rate'],
        'cogs': calc['cogs'],
        'gross_profit': calc['gross_profit'],
        'labor_cost': calc['labor_cost'],
        'fixed_cost': calc['fixed_cost'],
        'op_income': calc['op_income'],
        'payback_months': calc['payback_months'],
        'concept': calc['concept'],
        'action': calc['action']
    }
    
    db_plan = models.BusinessPlan(
        type=input_data.type,
        seats=input_data.seats,
        atv=input_data.atv,
        hours=input_data.hours,
        area=input_data.area,
        **db_fields
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def get_business_plan(db: Session, plan_id: int):
    return db.query(models.BusinessPlan).filter(models.BusinessPlan.id == plan_id).first()

def get_business_plans(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.BusinessPlan).order_by(models.BusinessPlan.created_at.desc()).offset(skip).limit(limit).all()


# ユーザー関連のCRUD関数
def get_user_by_email(db: Session, email: str):
    """メールアドレスでユーザーを取得"""
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserRegister):
    """新規ユーザーを作成"""
    # メールアドレスの重複チェック
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise ValueError("このメールアドレスは既に登録されています")
    
    # パスワードをハッシュ化
    hashed_password = hash_password(user.password)
    
    # ユーザーを作成
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise ValueError("このメールアドレスは既に登録されています")


def authenticate_user(db: Session, email: str, password: str):
    """ユーザー認証"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def get_user_by_id(db: Session, user_id: int):
    """IDでユーザーを取得"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_menu_suggestions(type: str, concept: str):
    data = {
        'カフェ': {
            'ヘルシー': [
                {'name': 'アサイーボウル', 'price': 880, 'description': 'スーパーフード満載、SNS映え抜群'},
                {'name': 'グリーンスムージー', 'price': 680, 'description': '野菜と果物のバランス◎'},
                {'name': 'キヌアサラダボウル', 'price': 950, 'description': '低GI、高タンパク質'}
            ],
            'SNS映え': [
                {'name': 'レインボーラテ', 'price': 750, 'description': '7色のグラデーションラテアート'},
                {'name': 'フルーツタワーパンケーキ', 'price': 1380, 'description': 'フォトジェニックな盛り付け'},
                {'name': 'ユニコーンフラペチーノ', 'price': 820, 'description': 'カラフルで可愛い限定ドリンク'}
            ]
        },
        '焼鳥': {
            'ヘルシー': [
                {'name': '野菜巻き串盛り合わせ', 'price': 980, 'description': 'アスパラ・トマト・なすの野菜串'},
                {'name': 'むね肉の塩焼き', 'price': 380, 'description': '低脂質・高タンパク'}
            ]
        },
        'ラーメン': {
            'ヘルシー': [
                {'name': '鶏白湯ラーメン（麺半分）', 'price': 850, 'description': 'コラーゲンたっぷり、低糖質'},
                {'name': '野菜たっぷりタンメン', 'price': 880, 'description': 'シャキシャキ野菜山盛り'}
            ]
        }
    }
    return data.get(type, {}).get(concept, [{'name': 'おすすめメニュー1', 'price': 800, 'description': 'お店の特色を活かした一品'}])


