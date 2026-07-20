import{u as l,r as s,j as e,L as c}from"./index-Bn80CCno.js";import{p as d}from"./purify.es-Bc-0F0ao.js";import{a as o}from"./axios-DbECNT_g.js";import{P as m}from"./PageHeader-BkMhDCss.js";import{L as x,A as p}from"./LoadingSpinner-Ctgg0DDs.js";import{U as h}from"./user-CpQ-yaIB.js";import{C as u}from"./calendar-vMp8CeVa.js";import{E as _}from"./eye-fbrhfXPT.js";import"./chevron-right-dHzuVeLD.js";const r={1:{id:1,category:"general",title:"2026년 4월 정기산행 안내 — 설악산 대청봉 코스",content:`안녕하세요, 국민산악회 회원 여러분.

4월 정기산행은 설악산 대청봉 코스로 진행됩니다.

■ 일시: 2026년 4월 12일(일) 오전 6시 출발
■ 코스: 오색약수터 → 대청봉 → 백담사 (약 16km)
■ 난이도: 중상
■ 준비물: 등산화, 스틱, 우의, 간식, 물 2L 이상
■ 참가비: 30,000원 (교통비 포함)

참가 신청은 3월 31일까지 게시판에 댓글로 남겨주세요.

안전한 산행을 위해 체력 관리에 유의하시기 바랍니다.

감사합니다.`,author_id:1,author_name:"홍길동",is_pinned:!0,views:128,created_at:"2026.03.20",updated_at:"2026.03.20"},2:{id:2,category:"event",title:"봄맞이 회원 친목 행사 개최",content:`봄을 맞아 회원 친목 행사를 개최합니다.

■ 일시: 2026년 4월 5일(토) 오후 12시
■ 장소: 서울숲 잔디광장
■ 내용: 바베큐 파티 + 레크리에이션
■ 참가비: 15,000원

가족 동반 가능하며, 소정의 기념품도 준비되어 있습니다.
많은 참여 부탁드립니다!`,author_id:1,author_name:"홍길동",is_pinned:!1,views:67,created_at:"2026.03.18",updated_at:"2026.03.18"},3:{id:3,category:"general",title:"산행 안전 수칙 필독 안내",content:`안전한 산행을 위한 필수 수칙을 안내드립니다.

1. 반드시 등산화를 착용하세요.
2. 기상 상황을 사전에 확인하세요.
3. 단독 산행은 자제하세요.
4. 충분한 물과 간식을 준비하세요.
5. 산행 중 쓰레기는 되가져오세요.
6. 일몰 2시간 전에는 하산을 시작하세요.
7. 긴급 시 119에 연락하세요.`,author_id:2,author_name:"김철수",is_pinned:!1,views:45,created_at:"2026.03.15",updated_at:"2026.03.15"},4:{id:4,category:"general",title:"회비 납부 안내 (2026년 상반기)",content:`2026년 상반기 회비 납부 안내입니다.

■ 금액: 연회비 50,000원
■ 납부 기한: 2026년 3월 31일
■ 계좌: 국민은행 000-000-000000 (국민산악회)

납부 후 게시판에 입금 확인 댓글을 남겨주세요.`,author_id:3,author_name:"이영희",is_pinned:!1,views:89,created_at:"2026.03.10",updated_at:"2026.03.10"},5:{id:5,category:"event",title:"신입 회원 환영 산행 (북한산)",content:`신입 회원을 위한 환영 산행을 진행합니다.

■ 일시: 2026년 3월 22일(토)
■ 코스: 북한산 백운대 (초급 코스)
■ 집합: 북한산성 입구 오전 9시

새로 가입하신 분들의 많은 참여 바랍니다.`,author_id:4,author_name:"박민수",is_pinned:!1,views:34,created_at:"2026.03.05",updated_at:"2026.03.05"}};function E(){const{id:a}=l(),[t,n]=s.useState(null);return s.useEffect(()=>{o.get(`/api/notices/${a}`).then(i=>n(i.data.data??r[a??"1"]??null)).catch(()=>n(r[a??"1"]??null))},[a]),t?e.jsxs("div",{children:[e.jsx(m,{title:"공지사항",breadcrumbs:[{label:"홈",to:"/"},{label:"공지사항",to:"/notice"},{label:t.title}]}),e.jsxs("div",{className:"max-w-4xl mx-auto px-4 py-6",children:[e.jsxs("div",{className:"card animate-fade-in",children:[e.jsxs("div",{className:"px-5 py-4 border-b border-gray-100",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.category==="event"&&e.jsx("span",{className:"text-[9px] bg-accent-light text-accent-dark px-1.5 py-0.5 rounded",children:"행사"}),t.is_pinned&&e.jsx("span",{className:"text-[9px] bg-primary text-white px-1.5 py-0.5 rounded",children:"공지"})]}),e.jsx("h1",{className:"text-base font-semibold text-gray-800",children:t.title}),e.jsxs("div",{className:"flex items-center gap-3 mt-2 text-xs text-gray-400",children:[e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(h,{className:"w-3 h-3"}),t.author_name]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(u,{className:"w-3 h-3"}),t.created_at]}),e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(_,{className:"w-3 h-3"}),t.views]})]})]}),t.thumbnail&&e.jsx("img",{src:`/uploads/${t.thumbnail}`,alt:t.title,className:"w-full max-h-[420px] object-cover border-b border-gray-100"}),e.jsx("div",{className:"px-5 py-6 text-sm text-gray-700 leading-relaxed min-h-[200px]",dangerouslySetInnerHTML:{__html:d.sanitize(t.content)}})]}),e.jsx("div",{className:"mt-4 flex justify-end",children:e.jsxs(c,{to:"/notice",className:"btn-ghost flex items-center gap-1.5",children:[e.jsx(p,{className:"w-3.5 h-3.5"}),"목록으로"]})})]})]}):e.jsx(x,{})}export{E as default};
