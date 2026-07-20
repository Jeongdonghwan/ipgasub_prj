import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'

export default function FindAccount() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5">
          <KeyRound className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 mb-2">아이디 · 비밀번호 찾기</h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          해당 기능은 준비 중입니다.<br />
          계정 관련 문의는 협회 사무국(02-000-0000)으로 연락 주세요.
        </p>
        <Link to="/auth/login" className="btn-primary inline-block px-8 py-3">로그인으로 돌아가기</Link>
      </div>
    </div>
  )
}
