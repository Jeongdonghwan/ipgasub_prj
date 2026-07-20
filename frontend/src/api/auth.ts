import api from './axios'
import type { ApiResponse, LoginResponse } from '../types'

/** 로그인 API 호출 — Login 페이지와 헤더 상시 로그인 폼이 공유 */
export async function loginRequest(username: string, password: string) {
  const res = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', { username, password })
  return res.data.data!
}

/** axios 에러에서 서버 메시지 추출 */
export function errorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { error?: string } } }
  return e.response?.data?.error ?? fallback
}
