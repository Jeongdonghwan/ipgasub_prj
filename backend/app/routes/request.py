from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from ..models.request import RegistrationRequest, CertificateRequest
from ..utils.auth_helpers import admin_required

request_bp = Blueprint('request', __name__)

CERT_TYPES = {'membership', 'career', 'award'}
REG_STATUSES = {'pending', 'done', 'rejected'}
CERT_STATUSES = {'pending', 'issued', 'rejected'}


# ─── 회원등록신청서 ──────────────────────────────────────────────────────────
@request_bp.route('/registration', methods=['POST'])
def create_registration():
    data = request.get_json() or {}
    if not (data.get('name') or '').strip() or not (data.get('phone') or '').strip():
        return jsonify({'success': False, 'error': '이름과 연락처를 입력하세요.'}), 400
    req = RegistrationRequest(
        name=data['name'].strip(),
        phone=data['phone'].strip(),
        email=(data.get('email') or '').strip(),
        birth=(data.get('birth') or '').strip(),
        content=(data.get('content') or '').strip(),
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({
        'success': True,
        'data': req.to_dict(),
        'message': '등록 신청이 접수되었습니다. 협회에서 확인 후 연락드리겠습니다.',
    }), 201


@request_bp.route('/registration', methods=['GET'])
@admin_required
def list_registrations():
    status = request.args.get('status')
    query = RegistrationRequest.query
    if status in REG_STATUSES:
        query = query.filter_by(status=status)
    items = query.order_by(RegistrationRequest.created_at.desc()).all()
    pending_count = RegistrationRequest.query.filter_by(status='pending').count()
    return jsonify({'success': True, 'data': {
        'items': [r.to_dict() for r in items],
        'pending_count': pending_count,
    }})


@request_bp.route('/registration/<int:req_id>', methods=['PATCH'])
@admin_required
def update_registration(req_id):
    req = RegistrationRequest.query.get_or_404(req_id)
    status = (request.get_json() or {}).get('status')
    if status not in REG_STATUSES:
        return jsonify({'success': False, 'error': '잘못된 상태값입니다.'}), 400
    req.status = status
    db.session.commit()
    return jsonify({'success': True, 'data': req.to_dict()})


# ─── 증명서발급 신청 ─────────────────────────────────────────────────────────
@request_bp.route('/certificates', methods=['POST'])
@jwt_required()
def create_certificate():
    data = request.get_json() or {}
    cert_type = data.get('cert_type')
    if cert_type not in CERT_TYPES:
        return jsonify({'success': False, 'error': '증명서 종류를 선택하세요.'}), 400
    req = CertificateRequest(
        user_id=get_jwt_identity(),
        cert_type=cert_type,
        purpose=(data.get('purpose') or '').strip(),
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({
        'success': True,
        'data': req.to_dict(),
        'message': '증명서 발급 신청이 접수되었습니다.',
    }), 201


@request_bp.route('/certificates/mine', methods=['GET'])
@jwt_required()
def my_certificates():
    items = CertificateRequest.query.filter_by(user_id=get_jwt_identity()) \
        .order_by(CertificateRequest.created_at.desc()).all()
    return jsonify({'success': True, 'data': {'items': [r.to_dict() for r in items]}})


@request_bp.route('/certificates', methods=['GET'])
@admin_required
def list_certificates():
    status = request.args.get('status')
    query = CertificateRequest.query
    if status in CERT_STATUSES:
        query = query.filter_by(status=status)
    items = query.order_by(CertificateRequest.created_at.desc()).all()
    pending_count = CertificateRequest.query.filter_by(status='pending').count()
    return jsonify({'success': True, 'data': {
        'items': [r.to_dict() for r in items],
        'pending_count': pending_count,
    }})


@request_bp.route('/certificates/<int:req_id>', methods=['PATCH'])
@admin_required
def update_certificate(req_id):
    req = CertificateRequest.query.get_or_404(req_id)
    status = (request.get_json() or {}).get('status')
    if status not in CERT_STATUSES:
        return jsonify({'success': False, 'error': '잘못된 상태값입니다.'}), 400
    req.status = status
    db.session.commit()
    return jsonify({'success': True, 'data': req.to_dict()})
