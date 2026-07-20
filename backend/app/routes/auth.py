from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from .. import db
from ..models.user import User
from ..utils.auth_helpers import admin_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ['username', 'password', 'name']
    if not all(data.get(k) for k in required):
        return jsonify({'success': False, 'error': '필수 항목을 입력하세요.'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'success': False, 'error': '이미 사용 중인 아이디입니다.'}), 409

    user = User(
        username=data['username'],
        name=data['name'],
        phone=data.get('phone', ''),
        residence=data.get('residence', ''),
        age_group=data.get('age_group', ''),
        gender=data.get('gender', ''),
        # is_approved 는 기본 False — 관리자 승인 전까지 로그인 불가
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({
        'success': True,
        'data': user.to_dict(),
        'message': '가입 신청이 접수되었습니다. 관리자 승인 후 로그인할 수 있습니다.',
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not user.check_password(data.get('password', '')):
        return jsonify({'success': False, 'error': '아이디 또는 비밀번호가 틀렸습니다.'}), 401
    if not user.is_active:
        return jsonify({'success': False, 'error': '비활성화된 계정입니다.'}), 403
    # 관리자는 승인 절차 없이 로그인, 일반 회원은 승인 필요
    if user.role != 'admin' and not user.is_approved:
        return jsonify({'success': False, 'error': '관리자 승인 대기 중인 계정입니다. 승인 후 로그인할 수 있습니다.'}), 403

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    return jsonify({
        'success': True,
        'data': {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict(),
        }
    })


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'success': True, 'data': {'access_token': access_token}})


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({'success': True, 'data': user.to_dict()})


# ─── 회원 관리 (관리자) ──────────────────────────────────────────────────────
@auth_bp.route('/members', methods=['GET'])
@admin_required
def list_members():
    # status: pending(승인대기) | approved(승인완료) | all(전체)
    status = request.args.get('status', 'all')
    query = User.query.filter_by(role='member')
    if status == 'pending':
        query = query.filter_by(is_approved=False)
    elif status == 'approved':
        query = query.filter_by(is_approved=True)
    members = query.order_by(User.created_at.desc()).all()
    pending_count = User.query.filter_by(role='member', is_approved=False).count()
    return jsonify({
        'success': True,
        'data': {
            'items': [m.to_dict() for m in members],
            'pending_count': pending_count,
        },
    })


@auth_bp.route('/members/<int:user_id>/approve', methods=['POST'])
@admin_required
def approve_member(user_id):
    user = User.query.get_or_404(user_id)
    user.is_approved = True
    db.session.commit()
    return jsonify({'success': True, 'data': user.to_dict()})


@auth_bp.route('/members/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_member(user_id):
    user = User.query.get_or_404(user_id)
    if user.role == 'admin':
        return jsonify({'success': False, 'error': '관리자 계정은 삭제할 수 없습니다.'}), 400
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})
