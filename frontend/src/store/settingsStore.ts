import { create } from 'zustand'

export interface SiteSettings {
  footer_org_name: string
  footer_reg_number: string
  footer_tagline: string
  footer_address: string
  footer_ceo: string
  footer_phone: string
  footer_email: string
  footer_copyright: string
}

// 백엔드 DEFAULT_SETTINGS 와 동일 — API 응답 전까지 즉시 렌더링되어 깜빡임이 없다.
export const DEFAULT_SETTINGS: SiteSettings = {
  footer_org_name: '대한민국골프&파크기술협회',
  footer_reg_number: '(2026-전남광주통합특별시-1호)',
  footer_tagline: '건강한 골프 문화와 파크골프 기술의\n발전을 함께합니다.',
  footer_address: '전남광주통합특별시 광산구 상무대로 104\n(도산동, 해송빌딩)',
  footer_ceo: '김광만',
  footer_phone: '062-945-9015',
  footer_email: 'info@kgpta.or.kr',
  footer_copyright: '© 2026 사단법인 대한민국골프&파크기술협회. All rights reserved.',
}

interface SettingsState {
  settings: SiteSettings
  loaded: boolean
  load: (force?: boolean) => Promise<void>
  setSettings: (s: SiteSettings) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,
  load: async (force = false) => {
    if (get().loaded && !force) return
    try {
      // 공개 API — axios 를 쓰면 초기 번들에 포함되므로 fetch 사용
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/api/settings/`)
      const json = await res.json()
      set({ settings: { ...DEFAULT_SETTINGS, ...(json.data ?? {}) }, loaded: true })
    } catch {
      set({ loaded: true }) // 실패 시 기본값 유지
    }
  },
  setSettings: (s) => set({ settings: s, loaded: true }),
}))
