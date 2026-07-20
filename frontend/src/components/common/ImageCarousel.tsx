import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface CarouselItem {
  key: string | number
  title: string
  sub?: string      // 날짜
  label?: string    // 분류 라벨 (예: 대회안내 / 골프뉴스)
  img: string
  to: string
}

interface Props {
  items: CarouselItem[]
  perView?: number   // 데스크톱에서 한 번에 보일 카드 수 (작을수록 이미지가 큼)
  ratio?: number     // 이미지 높이 = 카드너비 × ratio
}

/** 가로 슬라이드(자동+화살표+도트) 이미지 카드 캐러셀 */
export default function ImageCarousel({ items, perView = 4, ratio = 0.6 }: Props) {
  const [count, setCount] = useState(perView)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      setCount(w >= 1024 ? perView : w >= 768 ? Math.min(perView, 2) : 1.2)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [perView])

  const maxIndex = Math.max(0, items.length - Math.floor(count))

  useEffect(() => {
    if (paused || items.length <= Math.floor(count)) return
    const t = setInterval(() => setIdx((p) => (p >= maxIndex ? 0 : p + 1)), 4000)
    return () => clearInterval(t)
  }, [paused, maxIndex, items.length, count])

  useEffect(() => { if (idx > maxIndex) setIdx(0) }, [maxIndex, idx])

  const go = useCallback((dir: 'prev' | 'next') => {
    setIdx((p) => (dir === 'next' ? (p >= maxIndex ? 0 : p + 1) : (p <= 0 ? maxIndex : p - 1)))
  }, [maxIndex])

  if (items.length === 0) {
    return <div className="card px-4 py-12 text-center text-sm text-gray-400">등록된 항목이 없습니다.</div>
  }

  const gap = 16
  const containerWidth = trackRef.current?.parentElement?.clientWidth ?? 1152
  const cardWidth = (containerWidth - gap * (Math.floor(count) - 1)) / count
  const translateX = idx * (cardWidth + gap)
  const dotCount = maxIndex + 1

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="overflow-hidden" ref={trackRef}>
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${translateX}px)` }}
        >
          {items.map((it) => (
            <Link
              key={it.key}
              to={it.to}
              className="flex-shrink-0 card p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
              style={{ width: `${cardWidth}px` }}
            >
              {/* 이미지 (상단) */}
              <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: `${Math.round(cardWidth * ratio)}px` }}>
                <img
                  src={it.img}
                  alt={it.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* 텍스트 (하단) */}
              <div className="px-1 pt-3.5 pb-1">
                {it.label && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-[3px] h-3 rounded-full bg-accent block" />
                    <span className="text-[11px] font-bold text-gray-500">{it.label}</span>
                  </div>
                )}
                <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {it.title}
                </h3>
                {it.sub && <div className="text-xs text-gray-400 mt-2">{it.sub}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {dotCount > 1 && (
        <>
          <button onClick={() => go('prev')} aria-label="이전"
            className="absolute left-[-12px] top-[30%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all z-10">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={() => go('next')} aria-label="다음"
            className="absolute right-[-12px] top-[30%] -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all z-10">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`${i + 1}`}
                className={`rounded-full h-1.5 transition-all ${i === idx ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
