"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { Globe3DProps, Float } from "@/types/dashboard"

export const Globe3D = ({ floats, selectedFloat, onFloatClick, focusRegion }: Globe3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const floatPointsRef = useRef<(THREE.Mesh | null)[]>([])
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
  })

  useEffect(() => {
    if (!mountRef.current) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    )
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create globe
    const geometry = new THREE.SphereGeometry(5, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Create float points
    const floatGeometry = new THREE.SphereGeometry(0.02, 8, 8)
    floats.forEach((float, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: float.isHighlighted ? 0xffff00 : 0x00ffff,
        transparent: true,
        opacity: float.isHighlighted ? 1 : 0.7,
      })
      const point = new THREE.Mesh(floatGeometry, material)

      // Convert lat/lon to 3D coordinates
      const phi = (90 - float.lat) * (Math.PI / 180)
      const theta = (float.lon + 180) * (Math.PI / 180)
      const radius = 5.1

      point.position.x = -(radius * Math.sin(phi) * Math.cos(theta))
      point.position.y = radius * Math.cos(phi)
      point.position.z = radius * Math.sin(phi) * Math.sin(theta)

      point.userData = { floatData: float, index }
      scene.add(point)
      floatPointsRef.current[index] = point
    })

    camera.position.z = 15

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = true
      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY }
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grabbing"
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!controlsRef.current.isDragging) return

      const deltaMove = {
        x: event.clientX - controlsRef.current.previousMousePosition.x,
        y: event.clientY - controlsRef.current.previousMousePosition.y,
      }

      // Apply rotation to globe and all float points together
      const rotationSpeed = 0.005
      if (globeRef.current) {
        globeRef.current.rotation.y += deltaMove.x * rotationSpeed
        globeRef.current.rotation.x += deltaMove.y * rotationSpeed

        // Clamp vertical rotation to prevent flipping
        globeRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, globeRef.current.rotation.x))
      }

      // Update float points to rotate with globe
      floatPointsRef.current.forEach((point) => {
        if (point && point.userData && globeRef.current) {
          // Apply the same rotation to each point
          const phi = (90 - point.userData.floatData.lat) * (Math.PI / 180)
          const theta = (point.userData.floatData.lon + 180) * (Math.PI / 180)
          const radius = 5.1

          // Create rotation matrix
          const rotationMatrix = new THREE.Matrix4()
          rotationMatrix.makeRotationFromEuler(new THREE.Euler(globeRef.current.rotation.x, globeRef.current.rotation.y, globeRef.current.rotation.z))

          // Calculate original position
          const originalPos = new THREE.Vector3(
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta),
          )

          // Apply rotation
          originalPos.applyMatrix4(rotationMatrix)
          point.position.copy(originalPos)
        }
      })

      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = false
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grab"
      }
    }

    const handleClick = (event: MouseEvent) => {
      // Only handle click if not dragging
      if (controlsRef.current.isDragging) return

      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      if (!rendererRef.current) return

      const rect = rendererRef.current.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      if (cameraRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current)
        const validPoints = floatPointsRef.current.filter((point): point is THREE.Mesh => point !== null)
        const intersects = raycaster.intersectObjects(validPoints)

        if (intersects.length > 0) {
          const clickedFloat = intersects[0].object.userData.floatData
          onFloatClick(clickedFloat)
        }
      }
    }

    renderer.domElement.style.cursor = "grab"
    renderer.domElement.addEventListener("mousedown", handleMouseDown, { passive: false })
    document.addEventListener("mousemove", handleMouseMove, { passive: false })
    document.addEventListener("mouseup", handleMouseUp, { passive: false })
    renderer.domElement.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (!controlsRef.current.isDragging) {
        globe.rotation.y += 0.001
        // Update float points with auto-rotation
        floatPointsRef.current.forEach((point) => {
          if (point) {
            const phi = (90 - point.userData.floatData.lat) * (Math.PI / 180)
            const theta = (point.userData.floatData.lon + 180) * (Math.PI / 180)
            const radius = 5.1

            const rotationMatrix = new THREE.Matrix4()
            rotationMatrix.makeRotationFromEuler(new THREE.Euler(globe.rotation.x, globe.rotation.y, globe.rotation.z))

            const originalPos = new THREE.Vector3(
              -(radius * Math.sin(phi) * Math.cos(theta)),
              radius * Math.cos(phi),
              radius * Math.sin(phi) * Math.sin(theta),
            )

            originalPos.applyMatrix4(rotationMatrix)
            point.position.copy(originalPos)
          }
        })
      }

      renderer.render(scene, camera)
    }
    animate()

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    globeRef.current = globe
    cameraRef.current = camera

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth
        const height = mountRef.current.clientHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update float highlighting
  useEffect(() => {
    floatPointsRef.current.forEach((point, index) => {
      if (point && floats[index] && point.material instanceof THREE.MeshBasicMaterial) {
        point.material.color.setHex(floats[index].isHighlighted ? 0xffff00 : 0x00ffff)
        point.material.opacity = floats[index].isHighlighted ? 1 : 0.7
      }
    })
  }, [floats])

  return <div ref={mountRef} className="w-full h-full" />
}
