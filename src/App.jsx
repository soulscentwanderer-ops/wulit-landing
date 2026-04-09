import { useState, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════
   BRAND TOKENS
   參照 wulit-design skill 精確色值
═══════════════════════════════════════ */
const C = {
  ink:   '#1A1714',  // 墨黑 — 帶棕底調的溫暖深墨
  ink2:  '#2E2820',  // 深墨
  gold:  '#C9920A',  // 燭金
  goldA: '#D4A830',  // 琥珀金
  goldD: '#B07A12',  // 深金
  lt:    '#F7F3EC',  // 暈光白
  mid:   '#EDE5D4',  // 光暈米
  sand:  '#D4C4A8',  // 沙暖
  cn:    "'Noto Serif TC', Georgia, serif",
  en:    "'Cormorant Garamond', Georgia, serif",
  ui:    "system-ui, -apple-system, sans-serif",
}

const BL = 'blur(24px)'
const BL_HERO = 'blur(36px) saturate(1.08)'
const BL_CARD = 'blur(22px) saturate(1.06)'

/** 比較表用：文字色加深約 20%（提高不透明度或略暗） */
const deepInk = (a) => `rgba(26,23,20,${Math.min(1, +(a * 1.2).toFixed(3))})`
const inkTable = '#100E0C'

/** 服務費用區：色階加深（30%＋15% 疊乘 ≈ ×1.495） */
const priceDeep = (a) => `rgba(26,23,20,${Math.min(1, +(a * 1.495).toFixed(3))})`
const priceGoldDeep = 'rgba(160,108,8,0.95)'
const pillBtn = (hover) => ({
  fontFamily: C.ui,
  fontSize: 11,
  letterSpacing: '0.12em',
  padding: '8px 20px',
  borderRadius: 20,
  border: 'none',
  cursor: 'none',
  background: `linear-gradient(135deg, ${C.goldD} 0%, ${C.lt} 50%, ${C.gold} 100%)`,
  color: C.ink,
  textDecoration: 'none',
  display: 'inline-block',
  textTransform: 'uppercase',
  transform: hover ? 'translateY(-2px) scale(1.04)' : 'none',
  transition: 'all .25s cubic-bezier(.4,0,.2,1)',
  boxShadow: hover ? '0 4px 16px rgba(201,146,10,.28)' : '0 1px 8px rgba(176,122,18,.12)',
})

/** 靈氣區塊右上角圖（不佔版面流） */
function M03CornerImg() {
  return (
    <div className="wulit-m03-lineart" style={{
      position: 'absolute',
      top: 96,
      right: 40,
      width: 148,
      height: 148,
      pointerEvents: 'none',
      opacity: 0.88,
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src="/images/8.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: goldImgOverlay(false),
          opacity: 0.85,
        }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   HOOKS
═══════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true) },
      { threshold }
    )
    const el = ref.current
    if (el) obs.observe(el)
    return () => { if (el) obs.unobserve(el) }
  }, [])
  return [ref, vis]
}

/* ═══════════════════════════════════════
   ANIMATION WRAPPER
═══════════════════════════════════════ */
function Up({ children, delay = 0, y = 20, style = {} }) {
  const [ref, vis] = useInView()
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}s,
                   transform 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
function Cursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [big, setBig] = useState(false)
  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY })
    const over = e => { if (e.target.closest('button,a,[data-h]')) setBig(true) }
    const out  = e => { if (e.target.closest('button,a,[data-h]')) setBig(false) }
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])
  const s = big ? 44 : 9
  return (
    <div style={{
      position: 'fixed', zIndex: 9999, pointerEvents: 'none',
      left: pos.x - s/2, top: pos.y - s/2,
      width: s, height: s, borderRadius: '50%',
      background: big ? 'rgba(201,146,10,0.13)' : 'rgba(201,146,10,0.65)',
      border: big ? '1px solid rgba(201,146,10,0.35)' : 'none',
      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    }} />
  )
}

/* ═══════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════ */
function ScrollBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement
      setPct(d.scrollTop / (d.scrollHeight - d.clientHeight) * 100)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, zIndex: 9998,
      height: 2, width: `${pct}%`,
      background: `linear-gradient(90deg, ${C.gold}, ${C.goldA})`,
      transition: 'width 0.1s',
    }} />
  )
}

/* ═══════════════════════════════════════
   SHARED UI
═══════════════════════════════════════ */
function Label({ children, light = false, price = false }) {
  return (
    <div style={{
      fontFamily: C.ui,
      fontSize: price ? 'calc(9px + 2pt)' : 9,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      fontWeight: price ? 600 : 400,
      color: price ? priceGoldDeep : (light ? 'rgba(212,168,48,0.55)' : C.goldD),
      display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36,
    }}>
      {children}
      <span style={{
        flex: 1, maxWidth: 40, height: 1,
        background: price ? priceGoldDeep : (light ? 'rgba(212,168,48,0.3)' : C.goldD),
        opacity: price ? 0.5 : 0.35,
      }} />
    </div>
  )
}

const goldImgOverlay = (dark) =>
  dark
    ? 'linear-gradient(145deg, rgba(212,168,48,0.16) 0%, rgba(201,146,10,0.12) 45%, rgba(176,122,18,0.1) 100%)'
    : 'linear-gradient(145deg, rgba(176,122,18,0.14) 0%, rgba(201,146,10,0.18) 42%, rgba(212,168,48,0.12) 100%)'

/** public/images 編號：2 服務本質、3 老吾（.jpg）、4 工作室、5–7 體驗流程；首頁 Hero 為 /videos/1.mp4 */
const IM = {
  m04: '/images/2.png',
  m05: '/images/3.jpg',
  m06: '/images/4.png',
  step1: '/images/5.png',
  step2: '/images/6.png',
  step3: '/images/7.png',
}

const cardGlassBase = {
  background: 'rgba(247,243,236,0.48)',
  backdropFilter: BL_CARD,
  WebkitBackdropFilter: BL_CARD,
  border: '1px solid rgba(176,122,18,0.12)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
}

function ImgSlot({ src, alt = '', label, hint, dark = false, style = {} }) {
  const [broken, setBroken] = useState(false)
  const has = src && !broken
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 8,
      position: 'relative',
      overflow: 'hidden',
      border: has ? 'none' : `1px dashed ${dark ? 'rgba(212,168,48,0.14)' : 'rgba(176,122,18,0.22)'}`,
      background: has
        ? (dark ? 'rgba(26,20,12,0.2)' : 'rgba(201,146,10,0.06)')
        : (dark ? 'rgba(255,255,255,0.02)' : 'rgba(201,146,10,0.04)'),
      borderRadius: 2,
      ...style,
    }}>
      {has && (
        <img
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            borderRadius: 'inherit',
          }}
        />
      )}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 1,
        background: goldImgOverlay(dark),
      }} />
      {!has && (
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
            stroke={dark ? 'rgba(212,168,48,0.25)' : 'rgba(176,122,18,0.3)'} strokeWidth={1}>
            <rect x={2} y={3} width={20} height={15} rx={2}/>
            <circle cx={8} cy={10} r={2.5}/>
            <path d="M2 15l5-4 4 4 3-3 7 6"/>
          </svg>
          {label && <span style={{ fontFamily: C.ui, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: dark ? 'rgba(212,168,48,0.3)' : 'rgba(176,122,18,0.4)' }}>{label}</span>}
          {hint && <span style={{ fontFamily: C.ui, fontSize: 8, color: dark ? 'rgba(212,168,48,0.18)' : 'rgba(176,122,18,0.25)' }}>{hint}</span>}
        </div>
      )}
    </div>
  )
}

/** 體驗流程：圓形圖＋淡金光陰影；無圖時顯示佔位文字 */
function StepRoundPh({ label, src, alt = '' }) {
  const [broken, setBroken] = useState(false)
  const has = src && !broken
  const glow = '0 6px 28px rgba(201,146,10,0.22), 0 2px 12px rgba(212,168,48,0.18), 0 0 0 1px rgba(212,168,48,0.12)'
  return (
    <div style={{
      width: 76,
      height: 76,
      borderRadius: '50%',
      flexShrink: 0,
      position: 'relative',
      boxShadow: glow,
      background: 'rgba(247,243,236,0.55)',
      backdropFilter: BL_CARD,
      WebkitBackdropFilter: BL_CARD,
      border: has ? '1px solid rgba(176,122,18,0.15)' : `1px dashed rgba(176,122,18,0.28)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {has && (
        <img
          src={src}
          alt={alt}
          onError={() => setBroken(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            borderRadius: '50%',
          }}
        />
      )}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
        background: goldImgOverlay(false),
      }} />
      {!has && (
        <span style={{
          position: 'relative', zIndex: 2,
          fontFamily: C.ui, fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(176,122,18,0.5)', textAlign: 'center', lineHeight: 1.35, padding: '0 6px',
        }}>{label}</span>
      )}
    </div>
  )
}

/* SVG Icons */
const IClock  = () => <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.goldA} strokeWidth={1.2}><circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 3"/></svg>
const IShield = () => <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.goldA} strokeWidth={1.2}><path d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>
const IPin    = () => <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.goldA} strokeWidth={1.2}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx={12} cy={9} r={2.5}/></svg>
const ICal    = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.2}><rect x={3} y={4} width={18} height={17} rx={2}/><path d="M8 2v4M16 2v4M3 9h18"/></svg>
const IDoor   = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.2}><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/><circle cx={15} cy={13} r={1}/></svg>
const ISpark  = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth={1.2}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>

/* Glass helper */
const glass = (bg, bdr, blur = BL) => ({
  background: bg,
  backdropFilter: blur,
  WebkitBackdropFilter: blur,
  borderTop: bdr ? `1px solid ${bdr}` : 'none',
})

/* Section wrapper */
const S = (extra = {}) => ({ padding: '88px 56px', maxWidth: 900, margin: '0 auto', ...extra })

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const TAGS  = ['不觸碰', '不更衣', '不弄亂頭髮', '自選香氣']
const FEATS = [
  { num: '01', I: IClock,  title: '精準高效',   desc: '30 分鐘完成\n午休時間剛好\n不佔用下班行程' },
  { num: '02', I: IShield, title: '零前置準備', desc: '穿著上班服直接來\n不需更衣\n做完直接回崗位' },
  { num: '03', I: IPin,    title: '步行可達',   desc: '科技大樓站附近\n步行距離\n零通勤浪費' },
]
const STEPS = [
  { n: '1', I: ICal,   t: '預約', ph: '線稿 ①', img: IM.step1, d: 'LINE 傳送想預約的日期和時段\n確認後告知工作室地址' },
  { n: '2', I: IDoor,  t: '到達', ph: '線稿 ②', img: IM.step2, d: '選擇讓你安心的香氣\n簡短確認今天的狀態' },
  { n: '3', I: ISpark, t: '充電', ph: '線稿 ③', img: IM.step3, d: '30 分鐘靜謐療程，不需說話\n結束後直接回去工作' },
]
const QA = [
  { q: '沒接觸過靈氣，可以體驗嗎？',  a: '完全可以。不需要任何靈性背景，帶著自己來就好。' },
  { q: '療程會觸碰我嗎？',            a: '不會。靈氣是非接觸式療法，雙手懸在距你幾公分的地方，全程穿著衣服平躺休息。' },
  { q: '30 分鐘夠嗎？',               a: '對午休快充來說足夠。很多人結束後說——身體變輕了，下午比較能專注。' },
  { q: '工作室在哪裡？',              a: '科技大樓捷運站步行可達。預約確認後，會私訊告知詳細地址。' },
  { q: '當天想取消怎麼辦？',          a: '提前 2 小時告知即可，非常彈性。' },
]
const CMP_ROWS = [
  { a: '需要更衣',        v: ['完全不需要', '需要脫衣',   '不需要',      '需要換裝'],       hi: [1,0,0,0] },
  { a: '身體接觸',        v: ['零接觸',     '全身接觸',   '無',          '無'],             hi: [1,0,0,0] },
  { a: '事前準備',        v: ['完全不需要', '需預留時間', '需習慣養成',  '需裝備場地'],     hi: [1,0,0,0] },
  { a: '午休 30 分可完成', v: ['可以',       '困難',       '可以，需自律', '困難'],          hi: [1,0,0,0] },
  { a: '效果方向',        v: ['能量整理 恢復平衡', '肌肉放鬆', '思緒沉澱', '體能釋放'],    hi: [1,0,0,0] },
]
const PAIN_CARDS = [
  { num: '01', title: '腦袋當機', lines: ['明明人在位子上', '腦袋卻像卡住的硬碟', '轉不動，也不知道從哪裡開始'] },
  { num: '02', title: '身體很重', lines: ['開完冗長的會議', '覺得身體重得像背了一座山', '睡一覺醒來，還是很累'] },
  { num: '03', title: '說不出哪裡不對', lines: ['講不出來，但就是很重', '不是生病，不是懶', '只是整個人有點「散掉」'] },
]

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function App() {
  const [hTag,  setHTag]  = useState(null)
  const [hFeat, setHFeat] = useState(null)
  const [hStep, setHStep] = useState(null)
  const [hPc,   setHPc]   = useState(null)
  const [hQa,   setHQa]   = useState(null)
  const [hBtn,  setHBtn]  = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const fn = e => setMouse({
      x: (e.clientX / window.innerWidth  - 0.5) * 40,
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <div style={{ fontFamily: C.cn, fontWeight: 300, color: C.ink, letterSpacing: '0.08em', cursor: 'none' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Noto+Serif+TC:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { cursor: none !important; }
        @keyframes haloDrift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.55; }
          33% { transform: translate(4%, -3%) scale(1.06); opacity: 0.72; }
          66% { transform: translate(-3%, 4%) scale(0.96); opacity: 0.6; }
        }
        @keyframes haloDriftSlow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
          50% { transform: translate(-5%, 3%) scale(1.08); opacity: 0.62; }
        }
        @media (max-width: 780px) {
          .wulit-m03-lineart { display: none; }
        }
        .wulit-m02-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          align-items: stretch;
        }
        @media (max-width: 720px) {
          .wulit-m02-grid { grid-template-columns: 1fr; }
          .wulit-m02-card { border-right: none !important; border-bottom: 1px solid rgba(176,122,18,0.15); }
          .wulit-m02-card:last-child { border-bottom: none; }
          .wulit-m08-grid { grid-template-columns: 1fr !important; }
        }
        .wulit-m08-grid { grid-template-columns: repeat(2, 1fr); }
        .wulit-halo-hero-a {
          position: absolute; width: min(78vmin, 520px); height: min(78vmin, 520px);
          border-radius: 50%; top: 8%; left: -5%;
          background: radial-gradient(circle, rgba(212,168,48,0.28) 0%, rgba(212,196,168,0.12) 35%, transparent 68%);
          filter: blur(48px);
          animation: haloDrift 20s ease-in-out infinite;
          pointer-events: none;
        }
        .wulit-halo-hero-b {
          position: absolute; width: min(65vmin, 440px); height: min(65vmin, 440px);
          border-radius: 50%; bottom: 22%; right: -8%;
          background: radial-gradient(circle, rgba(201,146,10,0.22) 0%, rgba(237,229,212,0.14) 40%, transparent 70%);
          filter: blur(42px);
          animation: haloDriftSlow 26s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .wulit-halo-cta-a {
          position: absolute; width: min(90vmin, 640px); height: min(90vmin, 640px);
          border-radius: 50%; top: -25%; left: calc(50% - min(45vmin, 320px));
          background: radial-gradient(circle, rgba(212,168,48,0.2) 0%, rgba(176,122,18,0.08) 45%, transparent 65%);
          filter: blur(56px);
          animation: haloDrift 24s ease-in-out infinite;
          pointer-events: none;
        }
        .wulit-halo-cta-b {
          position: absolute; width: min(70vmin, 480px); height: min(70vmin, 480px);
          border-radius: 50%; bottom: -15%; right: -10%;
          background: radial-gradient(circle, rgba(201,146,10,0.18) 0%, transparent 62%);
          filter: blur(44px);
          animation: haloDriftSlow 22s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── Fixed candlelight backdrop（光暈漸層） ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(148deg, #EDE5D4 0%, #D4C4A8 48%, #D4A830 100%)',
      }}>
        <div style={{ position:'absolute', top:'10%', left:'4%', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(237,229,212,.55) 0%,rgba(212,196,168,.22) 40%,transparent 72%)', transform: `translate(${mouse.x * 0.6}px, ${mouse.y * 0.6}px)`, transition: 'transform 1.2s cubic-bezier(0.4,0,0.2,1)' }}/>
        <div style={{ position:'absolute', bottom:'14%', right:'3%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,168,48,.18) 0%,rgba(212,196,168,.12) 45%,transparent 70%)', transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`, transition: 'transform 1.5s cubic-bezier(0.4,0,0.2,1)' }}/>
        <div style={{ position:'absolute', top:'48%', left:'32%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(237,229,212,.35) 0%,transparent 68%)', transform: `translate(${mouse.x * 0.8}px, ${mouse.y * 0.8}px)`, transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)' }}/>
      </div>

      <Cursor />
      <ScrollBar />

      {/* ══ M01 HERO：滿版影片 + logo ══ */}
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#14110e' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="wulit-halo-hero-a" />
          <div className="wulit-halo-hero-b" />
        </div>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 2,
          }}
        >
          <source src="/videos/1.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            background: goldImgOverlay(true),
            opacity: 0.32,
          }}
        />
        <div style={{ position: 'absolute', top: 28, left: 40, zIndex: 10, opacity: 0.5 }}>
          <img src="/logo3.png" alt="吾光療域" style={{ height: 40, width: 'auto', maxWidth: 140, objectFit: 'contain', display: 'block' }} />
        </div>
        <p style={{
          position: 'absolute',
          left: 56,
          bottom: 56,
          zIndex: 6,
          fontFamily: C.ui,
          fontSize: 12,
          letterSpacing: '0.13em',
          color: 'rgba(247,243,236,0.58)',
          lineHeight: 1.9,
        }}>
          專為忙碌上班族設計的午休能量充電
        </p>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 180,
            background: 'linear-gradient(to bottom, transparent, #F7F3EC)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      </div>

      {/* ══ M02 痛點 ══ */}
      <div style={glass('rgba(247,243,236,0.74)', 'rgba(247,243,236,0.6)')}>
        <div style={S()}>
          <Up><Label>你有這種感覺嗎</Label></Up>
          <div className="wulit-m02-grid">
            {PAIN_CARDS.map((c, i) => (
              <Up key={c.num} delay={0.06 * i}>
                <div
                  className="wulit-m02-card"
                  style={{
                    position: 'relative',
                    padding: '12px 22px 28px',
                    borderRight: i < 2 ? '1px solid rgba(176,122,18,0.15)' : 'none',
                    borderRadius: 2,
                    ...cardGlassBase,
                    background: 'rgba(247,243,236,0.42)',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden', borderRadius: 2, marginBottom: 14 }}>
                    <img
                      src={['/images/10.png', '/images/11.png', '/images/12.png'][i]}
                      alt={['腦袋當機', '身體很重', '說不出哪裡不對'][i]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{
                    position:'absolute',
                    top: -16,
                    left: 12,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 96,
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: 'rgba(176,122,18,0.07)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}>
                    {c.num}
                  </div>
                  <div style={{ position:'relative', zIndex:1, width: 28, height: 1, background: '#C9920A', opacity: 0.4, marginBottom: 14 }} />
                  <div style={{
                    position:'relative',
                    zIndex:1,
                    fontFamily: C.en,
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: '#B07A12',
                    opacity: 0.6,
                    marginBottom: 10,
                    letterSpacing: '0.12em',
                  }}>{c.num}</div>
                  <div style={{
                    position:'relative',
                    zIndex:1,
                    fontFamily: C.cn,
                    fontSize: 18,
                    color: '#1A1714',
                    letterSpacing: '0.06em',
                    lineHeight: 1.45,
                    marginBottom: 14,
                    fontWeight: 400,
                  }}>{c.title}</div>
                  <div style={{
                    position:'relative',
                    zIndex:1,
                    fontFamily: C.ui,
                    fontSize: 13,
                    color: deepInk(0.52),
                    lineHeight: 2,
                    letterSpacing: '0.05em',
                  }}>
                    {c.lines.map((line, li) => (
                      <p key={li} style={{ marginBottom: li < c.lines.length - 1 ? 6 : 0 }}>{line}</p>
                    ))}
                  </div>
                </div>
              </Up>
            ))}
          </div>
          <Up delay={0.32}>
            <div style={{
              textAlign: 'center',
              marginTop: 56,
              fontFamily: C.cn,
              fontSize: 20,
              color: '#B07A12',
              letterSpacing: '0.06em',
              lineHeight: 1.85,
              fontWeight: 400,
            }}>
              很多時候，不是身體壞掉<br />
              是你的能量，已經太亂了
            </div>
          </Up>
        </div>
      </div>

      {/* ══ M03 靈氣是什麼 ══ */}
      <div style={glass('rgba(237,229,212,0.84)', 'rgba(176,122,18,0.15)')}>
        <div style={S({ position: 'relative' })}>
          <M03CornerImg />
          <Up><Label>靈氣是什麼</Label></Up>
          <Up delay={0.1}>
            <p style={{ fontFamily:C.cn, fontSize:20, lineHeight:1.8, letterSpacing:'0.06em', color:C.ink, marginBottom:8 }}>靈氣是一種<span style={{color:C.goldD}}>非接觸式</span>的能量調頻方式</p>
            <p style={{ fontFamily:C.cn, fontSize:20, lineHeight:1.8, letterSpacing:'0.06em', color:C.ink, marginBottom:28 }}>透過雙手懸停傳導，<span style={{color:C.goldD}}>溫柔整理你的能量場</span></p>
            <p style={{ fontFamily:C.ui, fontSize:12, color:deepInk(0.5), lineHeight:2, letterSpacing:'0.07em', marginBottom:48 }}>不需要你相信什麼 · 不需要進入任何狀態 · 你只要帶著自己，躺下來就好</p>
          </Up>
          <Up delay={0.2}>
            <div style={{ overflowX:'auto', borderRadius: 2, padding: '10px 8px', ...cardGlassBase }}>
              <div style={{ minWidth:560 }}>
                <div style={{ display:'grid', gridTemplateColumns:'140px repeat(4,1fr)', borderBottom:`1px solid rgba(176,122,18,.2)` }}>
                  <div style={{ padding:'11px 13px' }}/>
                  {['靈氣充電','芳療按摩','冥想','瑜伽健身'].map((h,i)=>(
                    <div key={h} style={{ padding:'11px 13px', fontFamily:C.ui, fontSize:'calc(9px + 2pt)', letterSpacing:'0.15em', textTransform:'uppercase', color:i===0?C.goldD:deepInk(0.38), borderBottom:i===0?`2px solid ${C.gold}`:'none', marginBottom:i===0?-1:0 }}>{h}</div>
                  ))}
                </div>
                {CMP_ROWS.map((row,ri)=>(
                  <div key={ri} style={{ display:'grid', gridTemplateColumns:'140px repeat(4,1fr)', borderBottom:`1px solid rgba(176,122,18,.1)` }}>
                    <div style={{ padding:'13px', fontFamily:C.ui, fontSize:'calc(10px + 2pt)', letterSpacing:'0.08em', color:deepInk(0.4), display:'flex', alignItems:'center' }}>{row.a}</div>
                    {row.v.map((v,vi)=>(
                      <div key={vi} style={{ padding:'13px', fontSize:'calc(12px + 2pt)', letterSpacing:'0.05em', lineHeight:1.5, display:'flex', alignItems:'center', color:row.hi[vi]?inkTable:deepInk(0.4), background:row.hi[vi]?'rgba(201,146,10,.06)':'transparent', borderLeft:row.hi[vi]?`1px solid rgba(201,146,10,.18)`:'none', borderRight:row.hi[vi]?`1px solid rgba(201,146,10,.18)`:'none', fontWeight:row.hi[vi]?400:300 }}>{v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Up>
        </div>
      </div>

      {/* ══ M04 服務本質 ══ */}
      <div style={glass('rgba(247,243,236,0.74)', 'rgba(247,243,236,0.6)')}>
        <div style={S()}>
          <Up><Label>專為上班族設計的午休充電</Label></Up>
          <Up delay={0.1}>
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: 320,
                objectFit: 'cover',
                borderRadius: 2,
                marginBottom: 48,
                display: 'block',
              }}
            >
              <source src="/videos/wulit-healing-session.mp4" type="video/mp4" />
            </video>
          </Up>
          <Up delay={0.2}>
            <p style={{ fontFamily:C.cn, fontSize:'clamp(17px,2.3vw,23px)', lineHeight:1.85, letterSpacing:'0.06em', color:C.ink, marginBottom:8 }}><span style={{color:C.goldD,fontWeight:400}}>非接觸式</span>能量調頻，穿著上班服即可</p>
            <p style={{ fontFamily:C.cn, fontSize:'clamp(17px,2.3vw,23px)', lineHeight:1.85, letterSpacing:'0.06em', color:C.ink }}>30分鐘後，帶著清爽的狀態回去工作</p>
          </Up>
          <div style={{ width:28, height:1, background:C.gold, opacity:.4, margin:'26px 0' }}/>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {TAGS.map((tag,i)=>(
              <Up key={tag} delay={0.1+i*0.08}>
                <button data-h onMouseEnter={()=>setHTag(i)} onMouseLeave={()=>setHTag(null)}
                  style={{
                    fontFamily:C.ui, fontSize:11, letterSpacing:'0.12em', padding:'8px 20px', borderRadius:20, border:'none', cursor:'none',
                    background: `linear-gradient(135deg, ${C.goldD} 0%, ${C.lt} 50%, ${C.gold} 100%)`,
                    color:C.ink, transform:hTag===i?'translateY(-2px) scale(1.04)':'none', transition:'all .25s cubic-bezier(.4,0,.2,1)',
                    boxShadow:hTag===i?`0 4px 16px rgba(201,146,10,.28)`:'0 1px 8px rgba(176,122,18,.12)',
                  }}>{tag}</button>
              </Up>
            ))}
          </div>
        </div>
      </div>

      {/* ══ M05 老吾 ══ */}
      <div style={glass('rgba(26,20,12,0.82)', 'rgba(212,168,48,0.08)')}>
        <div style={S()}>
          <Up><Label light>關於老吾 · 關於吾光</Label></Up>
          <div style={{ display:'grid', gridTemplateColumns:'5fr 6fr', gap:52, alignItems:'start' }}>
            <Up><ImgSlot src={IM.m05} alt="老吾" dark label="圖片 3" hint="public/images/3.jpg" style={{ width:'100%', minHeight:320, borderRadius:2 }}/></Up>
            <div>
              <Up delay={0.1}><div style={{ fontFamily:C.cn, fontSize:19, color:C.gold, marginBottom:13, letterSpacing:'0.06em', fontWeight:400 }}>麻瓜療癒師</div></Up>
              <Up delay={0.18}><h2 style={{ fontFamily:C.cn, fontSize:'clamp(17px,2.5vw,24px)', color:C.lt, fontWeight:300, lineHeight:1.45, letterSpacing:'0.05em', marginBottom:20, whiteSpace:'nowrap' }}>是透過練習而成的療癒者</h2></Up>
              <Up delay={0.25}>
                <div style={{ fontFamily:C.cn, fontSize:14, color:'rgba(247,243,236,0.67)', lineHeight:1.9, letterSpacing:'0.08em' }}>
                  {['大部分的人都跟我一樣','平凡、麻瓜，但很需要一個方式','可以讓自己在混亂中慢慢穩下來','','原來療癒不是天賦，是練習','不是敏感，是存在','不是會看到什麼，而是願意陪著別人'].map((l,i)=><p key={i} style={{marginBottom:l?7:14}}>{l}</p>)}
                </div>
              </Up>
              <Up delay={0.32}>
                <div style={{ marginTop:22, paddingTop:20, borderTop:`1px solid rgba(212,168,48,.15)`, fontFamily:C.en, fontSize:14, fontStyle:'italic', color:'rgba(201,146,10,.62)', letterSpacing:'0.08em', lineHeight:1.85 }}>
                  「每個人都有光，只是暫時忘記了」<br/>
                  <span style={{fontSize:11,letterSpacing:'0.12em'}}>— 老吾，吾光療域創辦人</span>
                </div>
              </Up>
            </div>
          </div>
        </div>
      </div>

      {/* ══ M06 亮點 ══ */}
      <div style={glass('rgba(237,229,212,0.84)', 'rgba(176,122,18,0.15)')}>
        <div style={S()}>
          <Up><Label>為什麼選擇吾光</Label></Up>
          <Up delay={0.1}>
            <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden', borderRadius: 2, marginBottom: 44 }}>
              <img src="/images/9.png" alt="為什麼選擇吾光" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </Up>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, borderRadius:2, padding:12, ...cardGlassBase, background:'rgba(237,229,212,0.35)' }}>
            {FEATS.map((f,i)=>(
              <Up key={f.num} delay={0.1+i*0.1}>
                <div data-h onMouseEnter={()=>setHFeat(i)} onMouseLeave={()=>setHFeat(null)}
                  style={{
                    ...cardGlassBase,
                    padding: '34px 24px',
                    background: hFeat===i?'rgba(247,243,236,.78)':'rgba(247,243,236,.52)',
                    transition: 'all .3s ease',
                    transform: hFeat===i?'translateY(-3px)':'none',
                    cursor: 'none',
                  }}>
                  <div style={{marginBottom:13}}><f.I/></div>
                  <div style={{fontFamily:C.ui,fontSize:8,letterSpacing:'0.16em',color:C.goldD,marginBottom:9}}>{f.num}</div>
                  <div style={{fontFamily:C.cn,fontSize:17,color:C.ink,lineHeight:1.4,letterSpacing:'0.06em',marginBottom:11}}>{f.title}</div>
                  <div style={{fontFamily:C.ui,fontSize:12,color:deepInk(0.5),lineHeight:1.95,letterSpacing:'0.05em'}}>{f.desc.split('\n').map((l,j)=><div key={j}>{l}</div>)}</div>
                </div>
              </Up>
            ))}
          </div>
        </div>
      </div>

      {/* ══ M07 體驗流程 ══ */}
      <div style={glass('rgba(247,243,236,0.74)', 'rgba(247,243,236,0.6)')}>
        <div style={S()}>
          <Up><Label>體驗流程</Label></Up>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, alignItems: 'start' }}>
            {STEPS.map((s,i)=>(
              <Up key={s.n} delay={0.1+i*0.12}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', position:'relative', padding:'0 32px' }}>
                  {i < 2 && (
                    <div style={{
                      position:'absolute',
                      top: 40,
                      right: 0,
                      width:'50%',
                      height: 1,
                      background:'rgba(176,122,18,0.18)',
                      zIndex: 0,
                    }}/>
                  )}
                  {i > 0 && (
                    <div style={{
                      position:'absolute',
                      top: 40,
                      left: 0,
                      width:'50%',
                      height: 1,
                      background:'rgba(176,122,18,0.18)',
                      zIndex: 0,
                    }}/>
                  )}

                  <div style={{
                    width: 80, height: 80,
                    borderRadius: '50%',
                    border: '1px solid rgba(201,146,10,0.3)',
                    background: 'rgba(201,146,10,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24,
                    position: 'relative', zIndex: 1,
                  }}>
                    <img src={['/images/5.png', '/images/6.png', '/images/7.png'][i]} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                  </div>

                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 11, fontStyle:'italic',
                    color: 'rgba(176,122,18,0.45)',
                    letterSpacing: '0.2em',
                    marginBottom: 10,
                  }}>
                    {s.n}
                  </div>

                  <div style={{
                    fontFamily: "'Noto Serif TC', Georgia, serif",
                    fontSize: 18,
                    color: '#1A1714',
                    letterSpacing: '0.06em',
                    marginBottom: 14,
                  }}>
                    {s.t}
                  </div>

                  <div style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: 12,
                    color: 'rgba(26,23,20,0.5)',
                    lineHeight: 2,
                    letterSpacing: '0.06em',
                  }}>
                    {s.d.split('\n').map((l, j) => <div key={j}>{l}</div>)}
                  </div>
                </div>
              </Up>
            ))}
          </div>
        </div>
      </div>

      {/* ══ M08 費用 ══ */}
      <div style={glass('rgba(237,229,212,0.84)', 'rgba(176,122,18,0.15)')}>
        <div style={S()}>
          <Up><Label price>服務費用</Label></Up>
          <div className="wulit-m08-grid" style={{ display:'grid', gap:24, maxWidth:860, alignItems:'stretch' }}>
            {[{
              name:'香療 | SCENTS 靈氣充電（30 分鐘）',
              price:'800',
              unit:'NT$ · 30 分鐘',
              promo:true,
              promoPrice:'720',
              desc:'結合靈氣能量與嗅覺調頻，透過香氣頻率快速釋放緊繃，回到當下的平靜與清明。適合午休充電、情緒疏通。',
            },{
              name:'深度靈氣療癒（90 分鐘）',
              price:'2,000',
              unit:'NT$ · 90 分鐘',
              promo:false,
              desc:'完整的身心靈療癒流程，透過靈氣能量疏通氣脈阻塞，深層釋放情緒與身體的累積壓力，帶來整合與更新。',
            }].map((pc,i)=>(
              <Up key={i} delay={0.1+i*0.12} style={{ height:'100%' }}>
                <div data-h onMouseEnter={()=>setHPc(i)} onMouseLeave={()=>setHPc(null)}
                  style={{
                    ...cardGlassBase,
                    border: `0.5px solid ${hPc===i?'rgba(176,122,18,.5)':'rgba(176,122,18,.25)'}`,
                    padding: '28px 24px',
                    borderRadius: 2,
                    background: hPc===i?'rgba(247,243,236,.62)':'rgba(247,243,236,.42)',
                    transition: 'all .3s ease',
                    transform: hPc===i?'translateY(-3px)':'none',
                    cursor: 'none',
                    minHeight: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <div style={{fontFamily:C.ui,fontSize:'calc(9px + 2pt)',letterSpacing:'0.15em',textTransform:'uppercase',color:priceDeep(0.38),marginBottom:15,lineHeight:1.7,fontWeight:600}}>{pc.name}</div>
                  {pc.promo ? (
                    <div>
                      <span style={{ textDecoration: 'line-through', color: '#9A8F85', fontSize: '1rem', fontFamily: C.ui }}>
                        NT$ {pc.price}
                      </span>
                      <div style={{ fontSize: '3rem', fontWeight: 300, color: '#1a1a1a', fontFamily: C.en, lineHeight: 1.05 }}>
                        {pc.promoPrice}
                      </div>
                      <p style={{ color: '#9A8F85', fontSize: '0.875rem', fontFamily: C.ui, marginTop: 4 }}>{pc.unit}</p>
                      <div style={{marginTop:14,padding:'10px 12px',background:'rgba(201,146,10,.1)',border:`0.5px solid rgba(201,146,10,.2)`,borderRadius:2,backdropFilter:BL_CARD,WebkitBackdropFilter:BL_CARD,boxShadow:'inset 0 1px 0 rgba(255,255,255,0.25)'}}>
                        <span style={{fontFamily:C.ui,fontSize:'0.78rem',letterSpacing:'0.12em',color:priceGoldDeep,display:'block'}}>推廣期限定 · 12:00－14:00</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{fontFamily:C.en,fontSize:'calc(44px + 2pt)',fontWeight:600,color:inkTable,lineHeight:1}}>{pc.price}</div>
                      <div style={{fontFamily:C.ui,fontSize:'calc(10px + 2pt)',letterSpacing:'0.13em',color:priceDeep(0.33),marginTop:5,fontWeight:600}}>{pc.unit}</div>
                    </div>
                  )}
                  <p style={{ fontFamily:C.ui, fontSize:12, color:deepInk(0.5), lineHeight:1.9, letterSpacing:'0.05em', marginTop:16 }}>
                    {pc.desc}
                  </p>
                  <a
                    href="#booking"
                    style={{ ...pillBtn(hPc===i), marginTop:'auto', alignSelf:'flex-start' }}
                  >
                    立即預約
                  </a>
                </div>
              </Up>
            ))}
          </div>
        </div>
      </div>

      {/* ══ M09 QA ══ */}
      <div style={glass('rgba(247,243,236,0.74)', 'rgba(247,243,236,0.6)')}>
        <div style={S()}>
          <Up><Label>常見問題</Label></Up>
          <div style={{maxWidth:610}}>
            {QA.map((item,i)=>(
              <Up key={i} delay={0.05*i}>
                <div data-h onMouseEnter={()=>setHQa(i)} onMouseLeave={()=>setHQa(null)}
                  style={{
                    marginBottom: i < QA.length - 1 ? 12 : 0,
                    borderRadius: 2,
                    padding: '20px 22px',
                    paddingLeft: hQa === i ? 26 : 22,
                    transition: 'padding .25s ease',
                    cursor: 'none',
                    ...cardGlassBase,
                    background: 'rgba(247,243,236,0.52)',
                  }}>
                  <div style={{fontFamily:C.cn,fontSize:15,color:hQa===i?C.goldD:C.gold,marginBottom:7,letterSpacing:'0.06em',lineHeight:1.6,transition:'color .25s'}}>{item.q}</div>
                  <div style={{fontFamily:C.ui,fontSize:13,color:deepInk(0.5),lineHeight:2,letterSpacing:'0.06em'}}>{item.a}</div>
                </div>
              </Up>
            ))}
          </div>
        </div>
      </div>

      {/* ══ M10 CTA ══ */}
      <div style={{...glass('rgba(26,20,12,0.4)','rgba(212,168,48,0.1)',BL_HERO),padding:'108px 56px 88px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',overflow:'hidden'}}>
        <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
          <div className="wulit-halo-cta-a" />
          <div className="wulit-halo-cta-b" />
        </div>
        <Up><p style={{fontFamily:C.cn,fontSize:'clamp(21px,3.6vw,33px)',color:'rgba(247,243,236,.76)',lineHeight:2.4,fontWeight:300,letterSpacing:'0.06em',marginBottom:48,position:'relative',zIndex:2}}>如果你有一點心動<br/>不用想太多</p></Up>
        <Up delay={0.2}>
          <a data-h href="https://line.me/R/ti/p/@103xydjx" target="_blank" rel="noreferrer"
            onMouseEnter={()=>setHBtn(true)} onMouseLeave={()=>setHBtn(false)}
            style={{ ...pillBtn(hBtn), padding:'10px 40px', marginBottom:13, position:'relative', zIndex:2 }}>
            預約充電
          </a>
        </Up>
        <Up delay={0.3}><div style={{fontFamily:C.ui,fontSize:11,letterSpacing:'0.2em',color:'rgba(201,146,10,0.34)',position:'relative',zIndex:2}}>@103xydjx</div></Up>
        <Up delay={0.42}>
          <div style={{ marginTop:56, display:'flex', flexDirection:'column', alignItems:'center', gap:14, position:'relative', zIndex:2 }}>
            <img src="/logo3.png" alt="吾光療域" style={{ height:44, width:'auto', maxWidth:160, objectFit:'contain', opacity:0.88 }} />
            <div style={{ fontFamily:C.en, fontSize:11, fontStyle:'italic', letterSpacing:'0.22em', color:'rgba(247,243,236,.12)' }}>wu.litheratki</div>
          </div>
        </Up>
      </div>

    </div>
  )
}
