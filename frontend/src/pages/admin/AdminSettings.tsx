import { useEffect, useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useToastStore } from '../../store/toastStore'
import { useSettingsStore, DEFAULT_SETTINGS, type SiteSettings } from '../../store/settingsStore'

type FieldType = 'text' | 'textarea'

const FIELDS: { key: keyof SiteSettings; label: string; hint?: string; type: FieldType }[] = [
  { key: 'footer_org_name', label: '협회명', hint: '& 기호는 자동으로 포인트 컬러로 표시됩니다.', type: 'text' },
  { key: 'footer_reg_number', label: '등록번호', hint: '비워두면 표시되지 않습니다.', type: 'text' },
  { key: 'footer_tagline', label: '소개 문구', hint: '줄바꿈이 그대로 반영됩니다.', type: 'textarea' },
  { key: 'footer_address', label: '주소', hint: '줄바꿈이 그대로 반영됩니다.', type: 'textarea' },
  { key: 'footer_ceo', label: '대표자', type: 'text' },
  { key: 'footer_phone', label: '전화번호', type: 'text' },
  { key: 'footer_email', label: '이메일', type: 'text' },
  { key: 'footer_copyright', label: '저작권 문구', hint: '푸터 맨 아래 한 줄입니다.', type: 'text' },
]

export default function AdminSettings() {
  const { settings, setSettings, load } = useSettingsStore()
  const [form, setForm] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const toast = useToastStore()

  useEffect(() => {
    // 항상 서버 최신값으로 시작 (다른 관리자가 바꿨을 수 있음)
    load(true).finally(() => setForm(useSettingsStore.getState().settings))
  }, [load])

  if (!form) return <LoadingSpinner />

  const change = (key: keyof SiteSettings, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))

  const dirty = JSON.stringify(form) !== JSON.stringify(settings)

  const handleSave = async () => {
    setSaving(true)
    try {
      const r = await api.put('/api/settings/', form)
      const saved = { ...DEFAULT_SETTINGS, ...(r.data.data ?? {}) }
      setSettings(saved)
      setForm(saved)
      toast.show('success', '푸터 정보가 저장되었습니다.')
    } catch {
      toast.show('error', '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="사이트 설정"
        breadcrumbs={[{ label: '관리자' }, { label: '사이트 설정' }]}
      />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-700">푸터 정보</h3>
            <button
              onClick={() => setForm(DEFAULT_SETTINGS)}
              className="text-xs text-gray-400 hover:text-primary flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              기본값으로 되돌리기
            </button>
          </div>

          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    className="input h-20 resize-none"
                    value={form[f.key]}
                    onChange={(e) => change(f.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="input"
                    value={form[f.key]}
                    onChange={(e) => change(f.key, e.target.value)}
                  />
                )}
                {f.hint && <p className="text-[11px] text-gray-400 mt-1">{f.hint}</p>}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {dirty ? '저장하지 않은 변경사항이 있습니다.' : '모든 변경사항이 저장되었습니다.'}
            </span>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="card px-6 py-5 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">미리보기</h3>
          <div className="text-[10px] text-gray-400">사단법인</div>
          <div className="text-[16px] font-extrabold text-gray-900">{form.footer_org_name}</div>
          {form.footer_reg_number && (
            <div className="text-[10px] font-semibold text-primary">{form.footer_reg_number}</div>
          )}
          <p className="text-xs text-gray-400 whitespace-pre-line mt-2">{form.footer_tagline}</p>
          <ul className="text-sm text-gray-500 mt-3 space-y-1">
            <li className="whitespace-pre-line">{form.footer_address}</li>
            <li>대표자 : {form.footer_ceo}</li>
            <li>{form.footer_phone}</li>
            <li>{form.footer_email}</li>
          </ul>
          <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-gray-100">{form.footer_copyright}</p>
        </div>
      </div>
    </div>
  )
}
