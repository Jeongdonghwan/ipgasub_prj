import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # UPLOAD_FOLDER 를 절대경로로 정규화 → 저장/서빙 경로 일치(cwd·root_path 무관)
    if not os.path.isabs(app.config['UPLOAD_FOLDER']):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # backend/
        app.config['UPLOAD_FOLDER'] = os.path.join(base_dir, app.config['UPLOAD_FOLDER'])

    # 업로드 폴더 생성
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # 모델 임포트 (Flask-Migrate 탐색용)
    from .models import User, Notice, BoardPost, BoardComment, GalleryAlbum, GalleryPhoto  # noqa: F401

    # Blueprint 등록
    from .routes.auth import auth_bp
    from .routes.notice import notice_bp
    from .routes.board import board_bp
    from .routes.gallery import gallery_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(notice_bp, url_prefix='/api/notices')
    app.register_blueprint(board_bp, url_prefix='/api/board')
    app.register_blueprint(gallery_bp, url_prefix='/api/gallery')

    # 업로드 파일 정적 서빙 (개발용, 프로덕션은 Nginx)
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    # ── 빌드된 프론트(frontend/dist) 통합 서빙 ─────────────────────────────
    # dist 가 있으면 프론트+API+이미지를 한 포트에서 서빙 (도메인·프록시·CORS 불필요).
    # 개발 중(dist 없음)에는 등록되지 않아 vite 개발서버와 충돌하지 않음.
    project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    frontend_dist = os.path.join(project_dir, 'frontend', 'dist')
    if os.path.isdir(frontend_dist):
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve_frontend(path):
            candidate = os.path.join(frontend_dist, path)
            if path and os.path.isfile(candidate):
                return send_from_directory(frontend_dist, path)
            # SPA 라우팅: 그 외 경로는 index.html 로 폴백
            return send_from_directory(frontend_dist, 'index.html')

    return app
