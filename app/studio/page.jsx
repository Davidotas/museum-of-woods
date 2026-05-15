'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Nav from '../components/Nav'
import CartSidebar from '../components/CartSidebar'
import Price from '../components/Price'
import { useCurrencyStore } from '../store/currency'
import { materials } from '../data/materials'
import { useCartStore } from '../store/cart'

/* ─── Data ─────────────────────────────────────────────── */

const PRODUCT_TYPES = [
  { id: 'wall-art',   label: 'Wall Art',       icon: '🖼️',  base: 75,  sizes: ['30×20cm','40×28cm','60×40cm','80×55cm'] },
  { id: 'soundwave',  label: 'Soundwave',       icon: '🎵',  base: 89,  sizes: ['30×15cm','50×20cm','70×28cm'] },
  { id: 'map-art',    label: 'Map Art',         icon: '🗺️',  base: 95,  sizes: ['30×30cm','45×45cm','60×60cm'] },
  { id: 'portrait',   label: 'Portrait',        icon: '👤',  base: 120, sizes: ['20×28cm','30×40cm','40×55cm'] },
  { id: 'key-holder', label: 'Key Holder',      icon: '🗝️',  base: 45,  sizes: ['30×10cm','40×12cm'] },
  { id: 'wedding',    label: 'Wedding Piece',   icon: '💍',  base: 135, sizes: ['40×28cm','60×40cm','80×55cm'] },
  { id: 'memorial',   label: 'Memorial',        icon: '🕊️',  base: 89,  sizes: ['25×18cm','35×25cm','50×35cm'] },
  { id: 'desk-sign',  label: 'Desk Sign',       icon: '🏷️',  base: 35,  sizes: ['30×8cm','40×10cm','50×12cm'] },
  { id: 'keepsake',   label: 'Keepsake Box',    icon: '📦',  base: 95,  sizes: ['20×14cm','25×18cm','30×22cm'] },
  { id: 'wood-slice', label: 'Wood Slice',      icon: '🌳',  base: 55,  sizes: ['20cm ⌀','30cm ⌀','40cm ⌀'] },
  { id: 'coordinates',label: 'Coordinates',     icon: '📍',  base: 65,  sizes: ['20×30cm','28×40cm','40×55cm'] },
  { id: 'family',     label: 'Family Name',     icon: '🏡',  base: 75,  sizes: ['40×20cm','60×30cm','80×40cm'] },
]

const WOODS = [
  { id: 'oak',    name: 'English Oak',    colour: '#c8985e', grain: 'Medium, rich golden tone', price: 0  },
  { id: 'walnut', name: 'Walnut',         colour: '#5c3a1e', grain: 'Dark, dramatic fine grain', price: 10 },
  { id: 'maple',  name: 'Hard Maple',     colour: '#e8d4a8', grain: 'Pale, almost white finish', price: 5  },
  { id: 'cherry', name: 'Wild Cherry',    colour: '#a0522d', grain: 'Warm reddish hues', price: 8         },
  { id: 'ash',    name: 'European Ash',   colour: '#d4c4a0', grain: 'Light with prominent grain', price: 0 },
  { id: 'birch',  name: 'Silver Birch',   colour: '#e8d8c0', grain: 'Soft pale honey tones', price: 0     },
  { id: 'ebony',  name: 'Macassar Ebony', colour: '#2c1a0e', grain: 'Striking dark streaks', price: 25    },
]

const STYLES = [
  { id: 'minimal',   label: 'Minimal',   desc: 'Clean, generous spacing',     preview: 'font-sans tracking-[.3em] text-sm uppercase' },
  { id: 'luxury',    label: 'Luxury',    desc: 'Serif with ornate detail',    preview: 'font-serif italic text-2xl' },
  { id: 'bold',      label: 'Bold',      desc: 'Strong, high contrast',       preview: 'font-sans font-bold text-2xl tracking-tight' },
  { id: 'script',    label: 'Artistic',  desc: 'Flowing, handwritten feel',   preview: 'font-serif text-2xl italic' },
  { id: 'modern',    label: 'Modern',    desc: 'Geometric, architectural',    preview: 'font-sans text-sm tracking-[.5em] uppercase font-light' },
  { id: 'heritage',  label: 'Heritage',  desc: 'Classic, traditional serif',  preview: 'font-serif text-xl' },
]

const FINISHES = [
  { id: 'raw',       label: 'Natural Raw',   desc: 'Untreated wood, organic feel',      price: 0  },
  { id: 'oiled',     label: 'Hand Oiled',    desc: 'Linseed oil, warm depth',           price: 8  },
  { id: 'lacquered', label: 'Lacquered',     desc: 'Durable gloss or matte coat',       price: 12 },
  { id: 'waxed',     label: 'Beeswax',       desc: 'Traditional wax, silky touch',      price: 10 },
]

const EXTRAS = [
  { id: 'giftbox',   label: 'Premium Gift Box',  desc: 'Luxury presentation packaging',  price: 12 },
  { id: 'card',      label: 'Handwritten Card',  desc: 'Personal message from our team', price: 5  },
  { id: 'rush',      label: 'Rush Production',   desc: 'Ready in 2 days (vs 5-7)',       price: 25 },
  { id: 'proof',     label: 'Design Proof PDF',  desc: 'Approve before we cut',          price: 0  },
]

const STEPS = [
  { n: 1, label: 'Product'  },
  { n: 2, label: 'Wood'     },
  { n: 3, label: 'Size'     },
  { n: 4, label: 'Design'   },
  { n: 5, label: 'Style'    },
  { n: 6, label: 'Finish'   },
  { n: 7, label: 'Extras'   },
  { n: 8, label: 'Review'   },
]

/* ─── 3D Canvas Preview ─────────────────────────────────── */
function WoodPreview({ product, wood, size, text1, text2, style, finish }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mountRef.current) return
    let cleanup

    const loadThree = async () => {
      const THREE = (await import('three')).default || await import('three')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      const el = mountRef.current
      if (!el) return
      const W = el.clientWidth, H = el.clientHeight

      // Scene
      const scene    = new THREE.Scene()
      const camera   = new THREE.PerspectiveCamera(40, W / H, 0.1, 100)
      camera.position.set(0, 0.5, 4.5)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)
      renderer.shadowMap.enabled = true
      el.appendChild(renderer.domElement)

      // Lighting
      const ambient = new THREE.AmbientLight(0xfff5e0, 0.8)
      scene.add(ambient)
      const key = new THREE.DirectionalLight(0xffe8c0, 1.8)
      key.position.set(3, 5, 4)
      key.castShadow = true
      scene.add(key)
      const fill = new THREE.DirectionalLight(0xc8a878, 0.5)
      fill.position.set(-3, 2, -2)
      scene.add(fill)

      // Determine aspect from product type
      const isPt = (id) => product?.id === id
      let pw = 1.8, ph = 1.2, pd = 0.08
      if (isPt('soundwave'))   { pw = 2.4; ph = 1.0;  pd = 0.07 }
      if (isPt('map-art'))     { pw = 1.6; ph = 1.6;  pd = 0.08 }
      if (isPt('portrait'))    { pw = 1.4; ph = 1.9;  pd = 0.07 }
      if (isPt('key-holder'))  { pw = 2.4; ph = 0.8;  pd = 0.14 }
      if (isPt('desk-sign'))   { pw = 2.6; ph = 0.65; pd = 0.10 }
      if (isPt('keepsake'))    { pw = 1.6; ph = 1.2;  pd = 0.5  }
      if (isPt('wood-slice'))  { pw = 1.5; ph = 1.5;  pd = 0.10 }
      if (isPt('coordinates')) { pw = 1.2; ph = 1.8;  pd = 0.07 }
      if (isPt('family'))      { pw = 2.2; ph = 0.9;  pd = 0.09 }
      if (isPt('wedding'))     { pw = 1.8; ph = 1.3;  pd = 0.07 }

      // Wood colour
      const woodColour = new THREE.Color(wood?.colour || '#c8985e')
      const roughness = finish === 'lacquered' ? 0.12 : finish === 'waxed' ? 0.28 : 0.72

      const mat = new THREE.MeshStandardMaterial({ color: woodColour, roughness, metalness: 0.0 })

      // Main slab
      const geo = isPt('wood-slice')
        ? new THREE.CylinderGeometry(0.85, 0.85, pd, 64)
        : new THREE.BoxGeometry(pw, ph, pd)

      const slab = new THREE.Mesh(geo, mat)
      slab.castShadow = true
      slab.receiveShadow = true
      scene.add(slab)

      // ── Product-specific extras ──
      const darkWood = new THREE.MeshStandardMaterial({ color: woodColour.clone().multiplyScalar(0.6), roughness: 0.8 })
      const metalMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#888888'), roughness: 0.3, metalness: 0.85 })

      if (isPt('key-holder')) {
        // Add 4 key hooks (small metal cylinders pointing forward)
        for (let i = 0; i < 4; i++) {
          const hook = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 12, 24), metalMat)
          hook.position.set(-0.75 + i * 0.5, -0.15, pd / 2 + 0.025)
          scene.add(hook)
          // Peg
          const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12), metalMat)
          peg.rotation.x = Math.PI / 2
          peg.position.set(-0.75 + i * 0.5, -0.18, pd / 2 + 0.09)
          scene.add(peg)
        }
        // Mounting hole at top
        const hole = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 12, 24), metalMat)
        hole.position.set(0, 0.28, pd / 2 + 0.02)
        scene.add(hole)
      }

      if (isPt('keepsake')) {
        // Box lid line
        const lidLine = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.02, 0.02, pd + 0.02), darkWood)
        lidLine.position.set(0, 0.15, 0)
        scene.add(lidLine)
        // Brass hinges
        for (let s of [-1, 1]) {
          const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 12), metalMat)
          hinge.rotation.z = Math.PI / 2
          hinge.position.set(s * (pw / 2 - 0.1), 0.15, pd / 2 + 0.01)
          scene.add(hinge)
        }
      }

      if (isPt('wood-slice')) {
        // Bark edge ring
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.05, 8, 64), darkWood)
        ring.rotation.x = Math.PI / 2
        scene.add(ring)
        // Hanging hole
        const hangHole = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 8, 24), metalMat)
        hangHole.position.set(0, 0.78, pd / 2 + 0.01)
        scene.add(hangHole)
      }

      if (isPt('desk-sign')) {
        // Stand legs
        for (let s of [-1, 1]) {
          const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.22), darkWood)
          leg.position.set(s * (pw / 2 - 0.15), -ph / 2 - 0.07, 0)
          leg.rotation.x = -Math.PI / 6
          scene.add(leg)
        }
      }

      // Text overlay canvas (face texture)
      const texCanvas = document.createElement('canvas')
      texCanvas.width  = 512
      texCanvas.height = 512
      const ctx = texCanvas.getContext('2d')

      const drawFace = () => {
        ctx.clearRect(0, 0, 512, 512)
        // Wood bg
        const grad = ctx.createLinearGradient(0, 0, 512, 512)
        const [r, g, b] = [
          parseInt(wood?.colour?.slice(1,3) || 'c8', 16),
          parseInt(wood?.colour?.slice(3,5) || '98', 16),
          parseInt(wood?.colour?.slice(5,7) || '5e', 16),
        ]
        grad.addColorStop(0, `rgba(${Math.min(r+30,255)},${Math.min(g+20,255)},${Math.min(b+15,255)},1)`)
        grad.addColorStop(0.5, `rgba(${r},${g},${b},1)`)
        grad.addColorStop(1, `rgba(${Math.max(r-25,0)},${Math.max(g-20,0)},${Math.max(b-15,0)},1)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, 512, 512)

        // Grain lines
        ctx.strokeStyle = `rgba(0,0,0,0.04)`
        ctx.lineWidth = 1.5
        for (let i = 0; i < 18; i++) {
          ctx.beginPath()
          const y = (i / 18) * 512 + Math.sin(i) * 8
          ctx.moveTo(0, y)
          ctx.bezierCurveTo(170, y + Math.sin(i*2)*5, 340, y - Math.sin(i*1.3)*5, 512, y + Math.sin(i)*4)
          ctx.stroke()
        }

        // Engraving vignette frame
        if (text1 || text2) {
          ctx.strokeStyle = 'rgba(0,0,0,0.18)'
          ctx.lineWidth = 2
          ctx.strokeRect(32, 32, 448, 448)
          ctx.strokeStyle = 'rgba(0,0,0,0.06)'
          ctx.lineWidth = 1
          ctx.strokeRect(40, 40, 432, 432)
        }

        // Text
        const engColor = `rgba(0,0,0,0.55)`
        if (text1) {
          ctx.fillStyle = engColor
          const styleMap = {
            minimal:  { font: '600 28px "Inter"',               spacing: 8 },
            luxury:   { font: 'italic 38px "Cormorant Garamond"', spacing: 2 },
            bold:     { font: '700 40px "Inter"',               spacing: -1 },
            script:   { font: 'italic 36px "Cormorant Garamond"', spacing: 2 },
            modern:   { font: '300 22px "Inter"',               spacing: 12 },
            heritage: { font: '400 34px "Cormorant Garamond"',  spacing: 1 },
          }
          const s = styleMap[style?.id] || styleMap.minimal
          ctx.font = s.font
          ctx.letterSpacing = `${s.spacing}px`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(text1, 256, text2 ? 230 : 256)
        }
        if (text2) {
          ctx.fillStyle = 'rgba(0,0,0,0.32)'
          ctx.font = '300 18px "Inter"'
          ctx.letterSpacing = '4px'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(text2.toUpperCase(), 256, 295)
        }
        if (!text1 && !text2) {
          ctx.fillStyle = 'rgba(0,0,0,0.10)'
          ctx.font = '300 16px "Inter"'
          ctx.letterSpacing = '3px'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('YOUR DESIGN APPEARS HERE', 256, 256)
        }
      }

      drawFace()
      const faceTex = new THREE.CanvasTexture(texCanvas)

      // Face material
      const faceMat = new THREE.MeshStandardMaterial({
        map: faceTex,
        roughness: finish === 'lacquered' ? 0.2 : 0.65,
        metalness: 0.0,
      })

      // Re-map face for box geometry
      if (!isPt('wood-slice')) {
        const mats = [mat, mat, mat, mat, faceMat, mat]
        slab.material = mats
      }

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enablePan = false
      controls.minPolarAngle = Math.PI / 6
      controls.maxPolarAngle = Math.PI * 0.72
      controls.minDistance = 2.5
      controls.maxDistance = 7
      controls.enableDamping = true
      controls.dampingFactor = 0.07
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.8

      sceneRef.current = { renderer, scene, camera, controls, faceTex, texCanvas, ctx, drawFace }

      let rafId
      const animate = () => {
        rafId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        if (!el) return
        const W2 = el.clientWidth, H2 = el.clientHeight
        camera.aspect = W2 / H2
        camera.updateProjectionMatrix()
        renderer.setSize(W2, H2)
      }
      window.addEventListener('resize', onResize)

      cleanup = () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', onResize)
        controls.dispose()
        renderer.dispose()
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }
    }

    loadThree().catch(console.error)
    return () => { cleanup?.() }
  }, [product?.id, wood?.id])

  // Update texture when text/style changes
  useEffect(() => {
    if (!sceneRef.current) return
    const { drawFace, faceTex } = sceneRef.current
    drawFace()
    faceTex.needsUpdate = true
  }, [text1, text2, style?.id])

  return (
    <div ref={mountRef} className="w-full h-full"
      style={{ minHeight: 320, cursor: 'grab' }}
    />
  )
}

/* ─── Step Components ───────────────────────────────────── */

function StepProduct({ value, onChange }) {
  const format = useCurrencyStore(s => s.format)
  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Choose Product Type</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>What would you like us to create?</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PRODUCT_TYPES.map(pt => (
          <button
            key={pt.id}
            onClick={() => onChange(pt)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-200 text-center"
            style={{
              borderColor: value?.id === pt.id ? '#c9a27e' : 'rgba(245,242,236,0.08)',
              background:  value?.id === pt.id ? 'rgba(201,162,126,0.08)' : 'rgba(255,255,255,0.02)',
              outline: value?.id === pt.id ? '1px solid rgba(201,162,126,0.2)' : 'none',
            }}
          >
            <span className="text-2xl" role="img">{pt.icon}</span>
            <span className="font-sans text-[11px] leading-tight" style={{ color: value?.id === pt.id ? '#c9a27e' : 'rgba(245,242,236,0.7)' }}>
              {pt.label}
            </span>
            <span className="font-sans text-[10px]" style={{ color: 'rgba(201,162,126,0.6)' }}>
              from {format(pt.base)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepWood({ value, onChange }) {
  const format = useCurrencyStore(s => s.format)
  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Choose Wood Species</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>Each species has a unique character. All sourced from UK woodlands.</p>
      <div className="space-y-2">
        {WOODS.map(w => (
          <button
            key={w.id}
            onClick={() => onChange(w)}
            className="w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left"
            style={{
              borderColor: value?.id === w.id ? '#c9a27e' : 'rgba(245,242,236,0.07)',
              background:  value?.id === w.id ? 'rgba(201,162,126,0.06)' : 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Swatch */}
            <span className="w-10 h-10 rounded-md shrink-0 ring-2 ring-offset-2"
              style={{ background: w.colour, ringColor: value?.id === w.id ? '#c9a27e' : 'transparent', ringOffsetColor: '#141c12' }} />
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-medium" style={{ color: '#f5f2ec' }}>{w.name}</div>
              <div className="font-sans text-[10px] mt-0.5" style={{ color: 'rgba(245,242,236,0.35)' }}>{w.grain}</div>
            </div>
            <div className="font-sans text-xs shrink-0" style={{ color: '#c9a27e' }}>
              {w.price > 0 ? `+${format(w.price)}` : 'Included'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepSize({ product, value, onChange }) {
  const format   = useCurrencyStore(s => s.format)
  const sizes    = product?.sizes || ['30×20cm', '40×28cm', '60×40cm']
  const priceMap = { 0: 0, 1: 15, 2: 30, 3: 45 }

  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Choose Size</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>Larger pieces have more detail. All sizes are hand-finished to order.</p>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map((s, i) => (
          <button
            key={s}
            onClick={() => onChange({ label: s, extra: priceMap[i] || 0 })}
            className="flex flex-col items-center justify-center gap-1.5 p-5 rounded-lg border transition-all duration-200"
            style={{
              borderColor: value?.label === s ? '#c9a27e' : 'rgba(245,242,236,0.08)',
              background:  value?.label === s ? 'rgba(201,162,126,0.07)' : 'rgba(255,255,255,0.02)',
              aspectRatio: '1.2',
            }}
          >
            {/* Visual size indicator */}
            <span className="border opacity-60" style={{
              borderColor: value?.label === s ? '#c9a27e' : 'rgba(245,242,236,0.4)',
              width: `${50 + i * 12}%`, height: `${42 + i * 10}%`,
            }} />
            <span className="font-sans text-sm font-medium mt-2" style={{ color: '#f5f2ec' }}>{s}</span>
            <span className="font-sans text-[10px]" style={{ color: 'rgba(201,162,126,0.7)' }}>
              {priceMap[i] ? `+${format(priceMap[i])}` : 'Base price'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Freehand Drawing Canvas ───────────────────────────── */
function DrawCanvas({ onSave }) {
  const canvasRef   = useRef(null)
  const drawing     = useRef(false)
  const lastPos     = useRef(null)
  const [tool, setTool]   = useState('pen')   // pen | eraser | line | rect | circle
  const [colour, setColour] = useState('#000000')
  const [size, setSize]   = useState(3)
  const [history, setHistory] = useState([])
  const colours = ['#000000','#5c3a1e','#c9a27e','#1a2318','#8b5e3c','#dc2626','#2563eb','#16a34a']

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect()
    const t = e.touches?.[0] || e
    return { x: t.clientX - r.left, y: t.clientY - r.top }
  }

  const save = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    setHistory(h => [...h, ctx.getImageData(0, 0, 400, 300)])
  }

  const undo = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || history.length === 0) return
    const prev = history[history.length - 1]
    ctx.putImageData(prev, 0, 0)
    setHistory(h => h.slice(0, -1))
  }

  const clear = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    save()
    ctx.clearRect(0, 0, 400, 300)
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(0, 0, 400, 300)
  }

  const startDraw = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    save()
    drawing.current = true
    lastPos.current = getPos(e, canvas)
  }

  const doDraw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = size * 4
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = size
      ctx.strokeStyle = colour
    }
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  const endDraw = (e) => {
    e.preventDefault()
    drawing.current = false
    if (onSave) onSave(canvasRef.current?.toDataURL())
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(0, 0, 400, 300)
  }, [])

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Tools */}
        <div className="flex gap-1 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            { id: 'pen',    icon: '✏️', label: 'Pen'    },
            { id: 'eraser', icon: '🧹', label: 'Eraser' },
          ].map(t => (
            <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
              className="w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all"
              style={{ background: tool === t.id ? 'rgba(201,162,126,0.3)' : 'transparent' }}>
              {t.icon}
            </button>
          ))}
        </div>

        {/* Colours */}
        <div className="flex gap-1">
          {colours.map(c => (
            <button key={c} onClick={() => setColour(c)}
              className="w-6 h-6 rounded-full transition-all"
              style={{ background: c, outline: colour === c ? '2px solid #c9a27e' : 'none', outlineOffset: '1px' }} />
          ))}
        </div>

        {/* Size */}
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px]" style={{ color: 'rgba(245,242,236,0.4)' }}>Size</span>
          <input type="range" min="1" max="20" value={size} onChange={e => setSize(Number(e.target.value))}
            className="w-20 accent-amber-400" style={{ accentColor: '#c9a27e' }} />
          <span className="font-sans text-[10px] w-5" style={{ color: 'rgba(245,242,236,0.5)' }}>{size}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 ml-auto">
          <button onClick={undo} className="px-3 py-1.5 rounded-lg font-sans text-[11px] transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(245,242,236,0.6)' }}>
            ↩ Undo
          </button>
          <button onClick={clear} className="px-3 py-1.5 rounded-lg font-sans text-[11px] transition-all hover:opacity-80"
            style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444' }}>
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full rounded-xl cursor-crosshair touch-none"
        style={{ border: '1px solid rgba(201,162,126,0.2)', background: '#f5f0e8' }}
        onMouseDown={startDraw}
        onMouseMove={doDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={doDraw}
        onTouchEnd={endDraw}
      />
      <p className="font-sans text-[10px] mt-2 text-center" style={{ color: 'rgba(245,242,236,0.25)' }}>
        Draw your design above — we'll engrave it exactly as you draw it
      </p>
    </div>
  )
}

function StepDesign({ product, text1, setText1, text2, setText2, onDrawSave }) {
  const hasAudio = product?.id === 'soundwave'
  const hasMap   = product?.id === 'map-art' || product?.id === 'coordinates'
  const hasPhoto = product?.id === 'portrait'
  const [mode, setMode] = useState('text') // text | draw | upload

  const MODES = [
    { id: 'text',   label: '✏️ Type text',    show: true },
    { id: 'draw',   label: '🖊️ Draw it',      show: !hasAudio && !hasMap && !hasPhoto },
    { id: 'upload', label: '📁 Upload image', show: !hasAudio && !hasMap },
  ].filter(m => m.show)

  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Add Your Content</h2>
      <p className="font-sans text-xs mb-4" style={{ color: 'rgba(245,242,236,0.4)' }}>
        {hasAudio ? 'Upload a voice message, song snippet or ambient sound.' :
         hasMap   ? 'Enter a location or coordinates to engrave.' :
         hasPhoto ? 'Upload a photo for laser portrait engraving.' :
         'Choose how to personalise your piece.'}
      </p>

      {/* Mode switcher (only for non-special types) */}
      {!hasAudio && !hasMap && !hasPhoto && (
        <div className="flex gap-1.5 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,242,236,0.06)' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className="flex-1 py-2.5 font-sans text-[11px] rounded-lg transition-all"
              style={{
                background: mode === m.id ? '#c9a27e' : 'transparent',
                color: mode === m.id ? '#0f1510' : 'rgba(245,242,236,0.5)',
              }}>
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Draw mode ── */}
      {mode === 'draw' && !hasAudio && !hasMap && !hasPhoto && (
        <DrawCanvas onSave={onDrawSave} />
      )}

      {/* ── Upload mode ── */}
      {mode === 'upload' && !hasAudio && !hasMap && !hasPhoto && (
        <div className="space-y-4">
          <div className="border border-dashed rounded-xl p-8 text-center" style={{ borderColor: 'rgba(201,162,126,0.25)', background: 'rgba(201,162,126,0.03)' }}>
            <div className="text-4xl mb-3">🖼️</div>
            <p className="font-sans text-sm mb-1" style={{ color: '#c9a27e' }}>Upload your design</p>
            <p className="font-sans text-[11px] mb-4" style={{ color: 'rgba(245,242,236,0.3)' }}>SVG, PNG, JPG — high contrast works best for engraving</p>
            <label className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-5 py-2.5 cursor-pointer rounded-lg transition-all"
              style={{ border: '1px solid rgba(201,162,126,0.4)', color: '#c9a27e' }}>
              Choose File
              <input type="file" accept="image/*,.svg" className="sr-only" />
            </label>
          </div>
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>Caption (optional)</label>
            <input type="text" className="input-wood w-full rounded-lg"
              placeholder="e.g. 'Our family crest · Est. 1987'"
              value={text2} onChange={e => setText2(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Text mode (default) ── */}
      {(mode === 'text' || hasMap || hasAudio || hasPhoto) && (
        hasMap ? (
        <div className="space-y-4">
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>Location or coordinates</label>
            <input type="text" className="input-wood w-full rounded-md"
              placeholder="e.g. 51.5074° N, 0.1278° W — or — London, UK"
              value={text1} onChange={e => setText1(e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>Caption (optional)</label>
            <input type="text" className="input-wood w-full rounded-md"
              placeholder="e.g. 'Where our story began'"
              value={text2} onChange={e => setText2(e.target.value)} />
          </div>
        </div>
      ) : hasAudio ? (
        <div className="space-y-4">
          <div className="border border-dashed rounded-lg p-8 text-center" style={{ borderColor: 'rgba(201,162,126,0.25)', background: 'rgba(201,162,126,0.04)' }}>
            <div className="text-3xl mb-3">🎙️</div>
            <p className="font-sans text-sm mb-1" style={{ color: '#c9a27e' }}>Upload audio file</p>
            <p className="font-sans text-[11px] mb-4" style={{ color: 'rgba(245,242,236,0.3)' }}>MP3, WAV, M4A — max 10MB</p>
            <label className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-5 py-2.5 cursor-pointer transition-all duration-300"
              style={{ border: '1px solid rgba(201,162,126,0.4)', color: '#c9a27e' }}>
              Choose File
              <input type="file" accept="audio/*" className="sr-only" />
            </label>
          </div>
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>Caption</label>
            <input type="text" className="input-wood w-full rounded-md"
              placeholder="e.g. 'First dance · 14.06.2024'"
              value={text2} onChange={e => setText2(e.target.value)} />
          </div>
        </div>
      ) : hasPhoto ? (
        <div className="space-y-4">
          <div className="border border-dashed rounded-lg p-8 text-center" style={{ borderColor: 'rgba(201,162,126,0.25)', background: 'rgba(201,162,126,0.04)' }}>
            <div className="text-3xl mb-3">🖼️</div>
            <p className="font-sans text-sm mb-1" style={{ color: '#c9a27e' }}>Upload a portrait photo</p>
            <p className="font-sans text-[11px] mb-4" style={{ color: 'rgba(245,242,236,0.3)' }}>JPG, PNG — clear face, good lighting</p>
            <label className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-5 py-2.5 cursor-pointer"
              style={{ border: '1px solid rgba(201,162,126,0.4)', color: '#c9a27e' }}>
              Choose Photo
              <input type="file" accept="image/*" className="sr-only" />
            </label>
          </div>
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>Name or caption</label>
            <input type="text" className="input-wood w-full rounded-md"
              placeholder="e.g. 'Granddad Ted, 1940 – 2023'"
              value={text2} onChange={e => setText2(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>
              Main text {text1.length > 0 && <span style={{ color: 'rgba(201,162,126,0.6)' }}>({text1.length}/60)</span>}
            </label>
            <input type="text" className="input-wood w-full rounded-lg"
              placeholder="e.g. 'Emma & James' or a quote…"
              maxLength={60} value={text1} onChange={e => setText1(e.target.value)} />
          </div>
          <div>
            <label className="font-sans text-[10px] tracking-[.25em] uppercase block mb-2" style={{ color: 'rgba(245,242,236,0.4)' }}>
              Sub-text <span style={{ color: 'rgba(245,242,236,0.2)' }}>(optional)</span>
            </label>
            <input type="text" className="input-wood w-full rounded-lg"
              placeholder="e.g. '14.02.2024 · London'"
              maxLength={60} value={text2} onChange={e => setText2(e.target.value)} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StepStyle({ value, onChange }) {
  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Typography & Style</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>How should the text look? Each style is hand-adjusted by our designers.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => onChange(s)}
            className="p-4 rounded-lg border text-left transition-all duration-200"
            style={{
              borderColor: value?.id === s.id ? '#c9a27e' : 'rgba(245,242,236,0.08)',
              background:  value?.id === s.id ? 'rgba(201,162,126,0.07)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <div className={`mb-2 ${s.preview}`} style={{ color: '#f5f2ec', fontSize: 'clamp(14px, 2vw, 20px)' }}>Aa</div>
            <div className="font-sans text-xs font-medium" style={{ color: value?.id === s.id ? '#c9a27e' : '#f5f2ec' }}>{s.label}</div>
            <div className="font-sans text-[10px] mt-0.5" style={{ color: 'rgba(245,242,236,0.3)' }}>{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepFinish({ value, onChange }) {
  const format = useCurrencyStore(s => s.format)
  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Surface Finish</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>Affects durability, touch, and depth of colour.</p>
      <div className="space-y-2.5">
        {FINISHES.map(f => (
          <button
            key={f.id}
            onClick={() => onChange(f)}
            className="w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left"
            style={{
              borderColor: value?.id === f.id ? '#c9a27e' : 'rgba(245,242,236,0.08)',
              background:  value?.id === f.id ? 'rgba(201,162,126,0.07)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <div className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center text-xl"
              style={{ background: 'rgba(201,162,126,0.1)' }}>
              {f.id === 'raw' ? '🪵' : f.id === 'oiled' ? '✨' : f.id === 'lacquered' ? '🔆' : '🕯️'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-medium" style={{ color: '#f5f2ec' }}>{f.label}</div>
              <div className="font-sans text-[10px] mt-0.5" style={{ color: 'rgba(245,242,236,0.35)' }}>{f.desc}</div>
            </div>
            <div className="font-sans text-xs shrink-0" style={{ color: '#c9a27e' }}>
              {f.price > 0 ? `+${format(f.price)}` : 'Included'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepExtras({ value, onChange }) {
  const format = useCurrencyStore(s => s.format)
  const toggle = (extra) => {
    const already = value.find(e => e.id === extra.id)
    onChange(already ? value.filter(e => e.id !== extra.id) : [...value, extra])
  }
  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Add-ons</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>Optional upgrades to complete your order.</p>
      <div className="space-y-2.5">
        {EXTRAS.map(ex => {
          const active = value.some(e => e.id === ex.id)
          return (
            <button
              key={ex.id}
              onClick={() => toggle(ex)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left"
              style={{
                borderColor: active ? '#c9a27e' : 'rgba(245,242,236,0.08)',
                background:  active ? 'rgba(201,162,126,0.07)' : 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Checkbox */}
              <span className="w-5 h-5 rounded shrink-0 flex items-center justify-center border"
                style={{ borderColor: active ? '#c9a27e' : 'rgba(245,242,236,0.2)', background: active ? '#c9a27e' : 'transparent' }}>
                {active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#0f1510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-medium" style={{ color: '#f5f2ec' }}>{ex.label}</div>
                <div className="font-sans text-[10px] mt-0.5" style={{ color: 'rgba(245,242,236,0.35)' }}>{ex.desc}</div>
              </div>
              <div className="font-sans text-xs shrink-0" style={{ color: '#c9a27e' }}>
                {ex.price > 0 ? `+${format(ex.price)}` : 'Free'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepReview({ product, wood, size, style, finish, extras, text1, text2, total, onAddToCart }) {
  const format = useCurrencyStore(s => s.format)
  const rows = [
    { label: product?.label || 'Product', value: format(product?.base || 0) },
    { label: `Wood: ${wood?.name || '—'}`, value: wood?.price > 0 ? `+${format(wood.price)}` : 'Included' },
    { label: `Size: ${size?.label || '—'}`, value: size?.extra > 0 ? `+${format(size.extra)}` : 'Base size' },
    { label: `Finish: ${finish?.label || '—'}`, value: finish?.price > 0 ? `+${format(finish.price)}` : 'Included' },
    ...(text1 ? [{ label: 'Engraving text', value: `+${format(15)}` }] : []),
    ...extras.map(e => ({ label: e.label, value: `+${format(e.price)}` })),
  ]

  return (
    <div>
      <h2 className="font-serif text-2xl mb-1.5" style={{ color: '#f5f2ec' }}>Review & Order</h2>
      <p className="font-sans text-xs mb-6" style={{ color: 'rgba(245,242,236,0.4)' }}>Check everything looks right. You'll receive a design proof before production begins.</p>

      {/* Summary */}
      <div className="rounded-lg overflow-hidden mb-6" style={{ border: '1px solid rgba(245,242,236,0.07)' }}>
        <div className="px-4 py-3" style={{ background: 'rgba(201,162,126,0.08)', borderBottom: '1px solid rgba(245,242,236,0.06)' }}>
          <span className="font-sans text-[10px] tracking-[.25em] uppercase" style={{ color: 'rgba(201,162,126,0.8)' }}>Order Summary</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(245,242,236,0.05)' }}>
          {rows.map((r, i) => (
            <div key={i} className="flex justify-between px-4 py-3">
              <span className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.55)' }}>{r.label}</span>
              <span className="font-sans text-xs" style={{ color: '#c9a27e' }}>{r.value}</span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-4" style={{ background: 'rgba(201,162,126,0.05)' }}>
            <span className="font-sans text-sm font-medium" style={{ color: '#f5f2ec' }}>Total</span>
            <span className="font-serif text-xl" style={{ color: '#c9a27e' }}>
              <Price gbp={total} />
            </span>
          </div>
        </div>
      </div>

      {/* Engrave text confirmation */}
      {(text1 || text2) && (
        <div className="rounded-lg p-4 mb-5" style={{ background: 'rgba(201,162,126,0.05)', border: '1px solid rgba(201,162,126,0.12)' }}>
          <p className="font-sans text-[10px] tracking-[.2em] uppercase mb-2" style={{ color: 'rgba(201,162,126,0.7)' }}>Engraving Text</p>
          {text1 && <p className="font-sans text-sm mb-1" style={{ color: '#f5f2ec' }}>"{text1}"</p>}
          {text2 && <p className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.45)' }}>{text2}</p>}
        </div>
      )}

      {/* Guarantees */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['🛡️','Free proof'],['🚚','UK delivery'],['♻️','FSC wood']].map(([icon, label]) => (
          <div key={label} className="text-center py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,242,236,0.06)' }}>
            <div className="text-xl mb-1">{icon}</div>
            <div className="font-sans text-[10px]" style={{ color: 'rgba(245,242,236,0.4)' }}>{label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddToCart}
        className="w-full flex items-center justify-center gap-3 py-4 font-sans text-xs tracking-[.2em] uppercase font-medium transition-all duration-300 hover:opacity-90"
        style={{ background: '#c9a27e', color: '#0f1510' }}
      >
        Add to Cart — <Price gbp={total} />
      </button>
      <p className="font-sans text-[10px] text-center mt-3" style={{ color: 'rgba(245,242,236,0.2)' }}>
        Free design proof · Pay securely at checkout
      </p>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function StudioPage() {
  const [step, setStep]         = useState(1)
  const [product, setProduct]   = useState(PRODUCT_TYPES[0])
  const [wood, setWood]         = useState(WOODS[0])
  const [size, setSize]         = useState(null)
  const [text1, setText1]       = useState('')
  const [text2, setText2]       = useState('')
  const [drawImage, setDrawImage] = useState(null)
  const [style, setStyle]       = useState(STYLES[0])
  const [finish, setFinish]     = useState(FINISHES[0])
  const [extras, setExtras]     = useState([])
  const [added, setAdded]       = useState(false)
  const addItem                 = useCartStore(s => s.addItem)

  // Auto-set default size when product changes
  useEffect(() => {
    setSize({ label: product.sizes[0], extra: 0 })
  }, [product.id])

  const total = (product?.base || 0)
    + (wood?.price || 0)
    + (size?.extra || 0)
    + (finish?.price || 0)
    + (text1 ? 15 : 0)
    + extras.reduce((s, e) => s + e.price, 0)

  const canNext = () => {
    if (step === 1) return !!product
    if (step === 2) return !!wood
    if (step === 3) return !!size
    return true
  }

  const handleAddToCart = () => {
    addItem({
      id:          `custom-${Date.now()}`,
      name:        `Custom ${product.label}`,
      tagline:     text1 || `Handcrafted in ${wood.name}`,
      price:       total,
      originalPrice: total,
      material:    wood.name,
      materialCode: wood.id,
      image:       '',
      category:    'custom',
    }, { engraving: text1, engravingLine2: text2, style: style.label, finish: finish.label, size: size?.label, extras: extras.map(e => e.label) })
    setAdded(true)
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <StepProduct value={product} onChange={p => { setProduct(p); }} />
      case 2: return <StepWood value={wood} onChange={setWood} />
      case 3: return <StepSize product={product} value={size} onChange={setSize} />
      case 4: return <StepDesign product={product} text1={text1} setText1={setText1} text2={text2} setText2={setText2} onDrawSave={setDrawImage} />
      case 5: return <StepStyle value={style} onChange={setStyle} />
      case 6: return <StepFinish value={finish} onChange={setFinish} />
      case 7: return <StepExtras value={extras} onChange={setExtras} />
      case 8: return <StepReview product={product} wood={wood} size={size} style={style} finish={finish} extras={extras} text1={text1} text2={text2} total={total} onAddToCart={handleAddToCart} />
      default: return null
    }
  }

  if (added) {
    return (
      <>
        <Nav />
        <CartSidebar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: '#0f1510' }}>
          <div className="text-center max-w-md px-8 py-16">
            <div className="text-6xl mb-6">🌳</div>
            <h1 className="font-serif text-3xl mb-3" style={{ color: '#f5f2ec' }}>Added to cart</h1>
            <p className="font-sans text-sm leading-relaxed mb-8" style={{ color: 'rgba(245,242,236,0.45)' }}>
              Your custom {product.label} in {wood.name} has been added. You'll receive a design proof before we begin cutting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/checkout" className="px-8 py-3.5 font-sans text-xs tracking-widest uppercase transition-colors"
                style={{ background: '#c9a27e', color: '#0f1510' }}>
                Checkout
              </Link>
              <button onClick={() => { setAdded(false); setStep(1); setText1(''); setText2(''); setExtras([]) }}
                className="px-8 py-3.5 font-sans text-xs tracking-widest uppercase transition-all"
                style={{ border: '1px solid rgba(201,162,126,0.3)', color: '#c9a27e' }}>
                Design another
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <CartSidebar />
      <main className="flex h-screen overflow-hidden" style={{ background: '#0f1510', paddingTop: 'var(--nav-h)' }}>

        {/* ── Left: 3D Preview ── */}
        <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
          style={{ background: '#0a0f0b', borderRight: '1px solid rgba(245,242,236,0.05)' }}>

          {/* Canvas */}
          <div className="flex-1 relative">
            <WoodPreview
              product={product}
              wood={wood}
              size={size}
              text1={text1}
              text2={text2}
              style={style}
              finish={finish}
            />
            {/* Orbit hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(245,242,236,0.4)" strokeWidth="1.5">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12h6M12 9l3 3-3 3"/>
              </svg>
              <span className="font-sans text-[10px] tracking-wider" style={{ color: 'rgba(245,242,236,0.4)' }}>
                DRAG TO ROTATE
              </span>
            </div>
          </div>

          {/* Wood / size info strip */}
          <div className="px-6 py-4 flex items-center justify-between shrink-0"
            style={{ borderTop: '1px solid rgba(245,242,236,0.05)', background: 'rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ background: wood.colour }} />
              <span className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.5)' }}>{wood.name}</span>
              <span style={{ color: 'rgba(245,242,236,0.15)' }}>·</span>
              <span className="font-sans text-xs" style={{ color: 'rgba(245,242,236,0.5)' }}>{size?.label || product.sizes[0]}</span>
            </div>
            <span className="font-serif text-lg" style={{ color: '#c9a27e' }}>
              <Price gbp={total} />
            </span>
          </div>
        </div>

        {/* ── Right: Configurator ── */}
        <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col shrink-0 overflow-hidden"
          style={{ borderLeft: '1px solid rgba(245,242,236,0.05)' }}>

          {/* Header */}
          <div className="px-6 py-4 shrink-0" style={{ borderBottom: '1px solid rgba(245,242,236,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-sans text-[10px] tracking-[.3em] uppercase" style={{ color: 'rgba(201,162,126,0.6)' }}>Custom Order</p>
                <h1 className="font-serif text-xl leading-tight" style={{ color: '#f5f2ec' }}>Design Your Piece</h1>
              </div>
              <div className="text-right">
                <p className="font-sans text-[10px]" style={{ color: 'rgba(245,242,236,0.3)' }}>Step {step} of {STEPS.length}</p>
                <p className="font-serif text-xl" style={{ color: '#c9a27e' }}><Price gbp={total} /></p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1">
              {STEPS.map(s => (
                <button
                  key={s.n}
                  onClick={() => s.n < step && setStep(s.n)}
                  className="flex-1 h-1 rounded-full transition-all duration-300"
                  style={{
                    background: s.n <= step
                      ? s.n === step ? '#c9a27e' : 'rgba(201,162,126,0.5)'
                      : 'rgba(245,242,236,0.08)',
                    cursor: s.n < step ? 'pointer' : 'default',
                  }}
                  title={s.label}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-sans text-[9px] tracking-[.15em] uppercase" style={{ color: 'rgba(201,162,126,0.5)' }}>
                {STEPS[step - 1]?.label}
              </span>
              <span className="font-sans text-[9px]" style={{ color: 'rgba(245,242,236,0.2)' }}>
                {Math.round((step / STEPS.length) * 100)}% complete
              </span>
            </div>
          </div>

          {/* Step body — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,162,126,0.2) transparent' }}>
            {stepContent()}
          </div>

          {/* Footer nav */}
          {step < 8 && (
            <div className="px-6 py-4 shrink-0 flex gap-3"
              style={{ borderTop: '1px solid rgba(245,242,236,0.06)', background: 'rgba(0,0,0,0.15)' }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-5 py-3 font-sans text-xs tracking-[.15em] uppercase transition-all"
                  style={{ border: '1px solid rgba(245,242,236,0.1)', color: 'rgba(245,242,236,0.5)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,242,236,0.25)'; e.currentTarget.style.color = '#f5f2ec' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,242,236,0.1)'; e.currentTarget.style.color = 'rgba(245,242,236,0.5)' }}
                >
                  ← Back
                </button>
              )}
              <button
                onClick={() => canNext() && setStep(s => s + 1)}
                className="flex-1 flex items-center justify-center gap-2 py-3 font-sans text-xs tracking-[.18em] uppercase transition-all duration-300"
                style={{
                  background: canNext() ? '#c9a27e' : 'rgba(245,242,236,0.08)',
                  color: canNext() ? '#0f1510' : 'rgba(245,242,236,0.3)',
                  cursor: canNext() ? 'pointer' : 'default',
                }}
              >
                {step === 7 ? 'Review Order →' : `Continue: ${STEPS[step]?.label} →`}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
