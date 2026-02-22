"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import { energy } from "@/lib/energy"

export default function SigilSurface3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mountEl = mountRef.current
    if (!mountEl) return

    const width = 800
    const height = 800
    const radius = 160
    const segments = 200

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    const camera = new THREE.OrthographicCamera(-250, 250, 250, -250, 1, 1000)
    camera.position.set(185, 185, 260)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    mountEl.replaceChildren()
    mountEl.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.8

    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    const geometry = new THREE.CircleGeometry(radius, segments)
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true
    })

    const surface = new THREE.Mesh(geometry, material)
    modelGroup.add(surface)

    const rimGeometry = new THREE.RingGeometry(radius - 1, radius + 1, 512)
    const rimMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide
    })

    const rim = new THREE.Mesh(rimGeometry, rimMaterial)
    rim.rotation.x = Math.PI / 2
    modelGroup.add(rim)

    const anchorGeom = new THREE.SphereGeometry(5, 32, 32)
    const anchorMat = new THREE.MeshBasicMaterial({ color: 0x000000 })

    const leftAnchor = new THREE.Mesh(anchorGeom, anchorMat)
    const rightAnchor = new THREE.Mesh(anchorGeom, anchorMat)

    modelGroup.add(leftAnchor)
    modelGroup.add(rightAnchor)

    let t = 0
    let rafId = 0

    function animate() {
      t += 0.01
      const zScale = 12 + Math.sin(t * 0.8) * 5

      const pos = geometry.attributes.position

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z = energy(x, y, t) * zScale
        pos.setZ(i, z)
      }

      pos.needsUpdate = true

      leftAnchor.position.set(-80, 0, energy(-80, 0, t) * zScale)
      rightAnchor.position.set(80, 0, energy(80, 0, t) * zScale)

      modelGroup.rotation.x = Math.sin(t * 0.35) * 0.14
      modelGroup.rotation.y = Math.cos(t * 0.4) * 0.14
      modelGroup.rotation.z = -t * 0.12

      controls.update()
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      controls.dispose()
      geometry.dispose()
      material.dispose()
      rimGeometry.dispose()
      rimMaterial.dispose()
      anchorGeom.dispose()
      anchorMat.dispose()
      renderer.dispose()
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} />
}
