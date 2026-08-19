from flask import Blueprint, request, jsonify
from .. import db
from ..models.setting import SiteSetting, DEFAULT_SETTINGS
from ..utils.auth_helpers import admin_required

setting_bp = Blueprint('setting', __name__)


@setting_bp.route('/', methods=['GET'])
def get_settings():
    return jsonify({'success': True, 'data': SiteSetting.all_as_dict()})


@setting_bp.route('/', methods=['PUT'])
@admin_required
def update_settings():
    data = request.get_json() or {}
    if not isinstance(data, dict):
        return jsonify({'success': False, 'error': '잘못된 요청입니다.'}), 400

    unknown = [k for k in data if k not in DEFAULT_SETTINGS]
    if unknown:
        return jsonify({'success': False, 'error': f'알 수 없는 항목: {", ".join(unknown)}'}), 400

    for key, value in data.items():
        row = SiteSetting.query.get(key)
        if row is None:
            row = SiteSetting(key=key)
            db.session.add(row)
        row.value = ('' if value is None else str(value)).strip()
    db.session.commit()
    return jsonify({'success': True, 'data': SiteSetting.all_as_dict()})
