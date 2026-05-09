'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useThemeStore } from '../store/theme'

gsap.registerPlugin(ScrollTrigger)

export default function Scene() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const { isDay } = useThemeStore()

  useEffect(() => {
    const mount = mountRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.fog = new THREE.FogExp2(0x1a2318, 0.15)

    // ── Camera ─────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.set(0, 0, 6)

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    // alpha:true = canvas is transparent; body CSS bg shows through automatically
    mount.appendChild(renderer.domElement)

    // ── Lighting ───────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xfff5e4, 0.6)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.5)
    keyLight.position.set(4, 6, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xc9a27e, 1.8)
    rimLight.position.set(-4, 2, -3)
    scene.add(rimLight)

    const fillLight = new THREE.PointLight(0xb5732a, 1.2, 20)
    fillLight.position.set(0, -3, 3)
    scene.add(fillLight)

    // ── Wood texture procedural ────────────────────────────
    const canvas2d = document.createElement('canvas')
    canvas2d.width = 512
    canvas2d.height = 512
    const ctx = canvas2d.getContext('2d')

    // Base warm amber
    ctx.fillStyle = '#b5732a'
    ctx.fillRect(0, 0, 512, 512)

    // Wood grain lines
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512
      const alpha = 0.04 + Math.random() * 0.12
      ctx.strokeStyle = `rgba(80, 40, 10, ${alpha})`
      ctx.lineWidth = 0.5 + Math.random() * 2.5
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= 512; x += 20) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 6)
      }
      ctx.stroke()
    }

    // Lighter highlights
    for (let i = 0; i < 20; i++) {
      const y = Math.random() * 512
      ctx.strokeStyle = `rgba(220, 180, 120, ${0.05 + Math.random() * 0.08})`
      ctx.lineWidth = 1 + Math.random() * 3
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= 512; x += 30) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 8)
      }
      ctx.stroke()
    }

    const woodTexture = new THREE.CanvasTexture(canvas2d)
    woodTexture.wrapS = THREE.RepeatWrapping
    woodTexture.wrapT = THREE.RepeatWrapping
    woodTexture.repeat.set(2, 2)

    // ── Spiral mesh — Museum of Woods signature shape ──────
    const helixPoints = []
    const turns = 4
    const helixSteps = 300
    for (let i = 0; i <= helixSteps; i++) {
      const t = i / helixSteps
      const angle = t * Math.PI * 2 * turns
      const radius = 1.1 - t * 0.55   // tapers from wide base to narrow top
      const height = t * 5.0 - 2.5
      helixPoints.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ))
    }
    const curve = new THREE.CatmullRomCurve3(helixPoints)
    const geo = new THREE.TubeGeometry(curve, 400, 0.055, 12, false)

    const mat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.45,
      metalness: 0.08,
      envMapIntensity: 1.2,
    })

    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // ── Glowing amber core (Museum centrepiece) ────────────
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc9a27e,
      emissive: 0xb5732a,
      emissiveIntensity: 1.8,
      roughness: 0.3,
      metalness: 0.2,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreMesh.position.set(0, -2.5, 0)
    scene.add(coreMesh)

    // Thin connecting rod at the base
    const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 5, 8)
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0x8b5e3c,
      roughness: 0.7,
      metalness: 0.1,
    })
    const rodMesh = new THREE.Mesh(rodGeo, rodMat)
    scene.add(rodMesh)


    // ── Floating particles (dust/wood chips) ──────────────
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      sizes[i] = Math.random() * 3 + 1
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const particleMat = new THREE.PointsMaterial({
      color: 0xc9a27e,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── GSAP scroll animations ─────────────────────────────

    // Hero intro — spiral rises and uncoils into view
    gsap.fromTo(
      mesh.rotation,
      { y: -2.4, x: 0.4 },
      { y: 0, x: 0.05, duration: 2.2, ease: 'power3.out', delay: 0.3 }
    )
    gsap.fromTo(mesh.position, { y: -3.5 }, { y: 0, duration: 2.2, ease: 'power3.out', delay: 0.3 })
    gsap.fromTo(coreMesh.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.6, ease: 'back.out(2)', delay: 1.0 })

    // Scroll section 1: spiral rises, camera drifts back
    ScrollTrigger.create({
      trigger: '#section-story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        mesh.rotation.x = 0.05 + self.progress * 0.25
        mesh.position.y = self.progress * 0.8
        camera.position.z = 6 + self.progress * 2
      },
    })

    // Scroll section 2: spiral tilts and shifts left
    ScrollTrigger.create({
      trigger: '#section-workshop',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        mesh.rotation.z = self.progress * 0.3
        mesh.position.x = self.progress * -1.4
        camera.position.z = 8 - self.progress * 1.5
      },
    })

    // Scroll section 3: spiral returns, scales subtly
    ScrollTrigger.create({
      trigger: '#section-features',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        mesh.rotation.z = 0.3 - self.progress * 0.3
        mesh.position.x = -1.4 + self.progress * 1.4
        camera.position.z = 6.5
      },
    })

    // Scroll section 4: elegant close — spiral faces up
    ScrollTrigger.create({
      trigger: '#section-cta',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        mesh.rotation.x = 0.3 - self.progress * 0.25
        mesh.scale.setScalar(1 + self.progress * 0.12)
        camera.position.z = 5.5 - self.progress * 0.5
      },
    })

    const clock = new THREE.Clock()

    // ── Render loop ────────────────────────────────────────
    let rafId
    function animate() {
      rafId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Gentle idle float + spiral slow spin
      mesh.position.y += Math.sin(elapsed * 0.4) * 0.0006
      mesh.rotation.y += 0.0015
      coreMesh.position.y = -2.5 + Math.sin(elapsed * 0.8) * 0.1
      coreMesh.material.emissiveIntensity = 1.6 + Math.sin(elapsed * 1.2) * 0.4

      // Particle drift
      particles.rotation.y = elapsed * 0.015
      particles.rotation.x = elapsed * 0.008

      // Key light subtle movement
      keyLight.position.x = 4 + Math.sin(elapsed * 0.3) * 1.5

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ─────────────────────────────────────────────
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.getAll().forEach((t) => t.kill())
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Update fog when theme changes (canvas bg handled by CSS automatically)
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene?.fog) return
    scene.fog.color.set(isDay ? 0xfaf7f2 : 0x1a2318)
    // Update fog density slightly — lighter in day mode
    scene.fog.density = isDay ? 0.08 : 0.15
  }, [isDay])

  return <div ref={mountRef} id="canvas-container" style={{ opacity: 0.18 }} />
}
