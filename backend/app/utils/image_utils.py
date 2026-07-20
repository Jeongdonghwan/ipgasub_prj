import os
import uuid
from datetime import datetime
from PIL import Image, ImageOps

# 썸네일 기준: 4:3 고정, 2배(레티나) 크기. 원본 비율과 무관하게 정확히 이 크기로 크롭됨.
THUMBNAIL_SIZE = (800, 600)


def save_image(file, upload_folder):
    """원본 저장 + 썸네일 생성. (original_path, thumbnail_path) 반환."""
    now = datetime.utcnow()
    sub_folder = os.path.join(str(now.year), f'{now.month:02d}')
    folder = os.path.join(upload_folder, sub_folder)
    os.makedirs(folder, exist_ok=True)

    ext = os.path.splitext(file.filename)[1].lower()
    basename = f'{uuid.uuid4().hex}{ext}'
    thumb_basename = f'thumb_{basename}'

    original_abs = os.path.join(folder, basename)
    thumbnail_abs = os.path.join(folder, thumb_basename)

    file.save(original_abs)

    with Image.open(original_abs) as img:
        img = img.convert('RGB')
        # 비율 유지 fit이 아니라 정확히 4:3로 크롭 (중앙 기준) → 화면 어디에 깔아도 잘림 일관
        img = ImageOps.fit(img, THUMBNAIL_SIZE, Image.LANCZOS)
        img.save(thumbnail_abs, 'JPEG', quality=85)

    # DB 저장용 상대 경로 (/ 구분자 통일)
    original_rel = os.path.join(sub_folder, basename).replace('\\', '/')
    thumbnail_rel = os.path.join(sub_folder, thumb_basename).replace('\\', '/')

    return original_rel, thumbnail_rel
