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
  const hoveredPointRef = useRef<THREE.Mesh | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const isHoveredRef = useRef<boolean>(false)
  const controlsRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    zoom: 15, // Initial zoom level
    minZoom: 8,
    maxZoom: 30,
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
    renderer.setClearColor(0xffffff, 0) // White clear color with full transparency
    mountRef.current.appendChild(renderer.domElement)

    // Create tooltip element
    const tooltip = document.createElement("div")
    tooltip.style.position = "fixed"
    tooltip.style.pointerEvents = "none"
    tooltip.style.zIndex = "1000"
    tooltip.style.display = "none"
    document.body.appendChild(tooltip)
    tooltipRef.current = tooltip

    // Create globe
    const geometry = new THREE.SphereGeometry(5, 128, 128) // Higher detail for better zoom experience
    const material = new THREE.MeshPhongMaterial({
      color: 0x3b82f6, // Blue-500 for light theme
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      specular: 0x2563eb, // Blue-600 for specular
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
    const floatGeometry = new THREE.SphereGeometry(0.05, 16, 16) // Increased size and detail for better clickability
    floats.forEach((float, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: float.isHighlighted ? 0xffff00 : 0x00ffff,
        transparent: true,
        opacity: float.isHighlighted ? 1 : 0.9,
        emissive: float.isHighlighted ? 0x444400 : 0x004444,
        emissiveIntensity: 0.3,
      })
      const point = new THREE.Mesh(floatGeometry, material)

      // Convert lat/lon to 3D coordinates
      const phi = (90 - float.lat) * (Math.PI / 180)
      const theta = (float.lon + 180) * (Math.PI / 180)
      const radius = 5.1

      point.position.x = -(radius * Math.sin(phi) * Math.cos(theta))
      point.position.y = radius * Math.cos(phi)
      point.position.z = radius * Math.sin(phi) * Math.sin(theta)

      point.userData = { floatData: float, index, originalScale: 1 }
      scene.add(point)
      floatPointsRef.current[index] = point
    })

    camera.position.z = controlsRef.current.zoom

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = true
      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY }
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grabbing"
      }
    }

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      controlsRef.current.isDragging = false
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grab"
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const zoomSpeed = 0.5
      const zoomDirection = event.deltaY > 0 ? 1 : -1
      
      controlsRef.current.zoom += zoomDirection * zoomSpeed
      controlsRef.current.zoom = Math.max(
        controlsRef.current.minZoom,
        Math.min(controlsRef.current.maxZoom, controlsRef.current.zoom)
      )
      
      if (cameraRef.current) {
        cameraRef.current.position.z = controlsRef.current.zoom
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault()

      // Handle hover effects even when not dragging
      if (!controlsRef.current.isDragging) {
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        if (rendererRef.current && cameraRef.current) {
          const rect = rendererRef.current.domElement.getBoundingClientRect()
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

          raycaster.setFromCamera(mouse, cameraRef.current)
          const validPoints = floatPointsRef.current.filter((point): point is THREE.Mesh => point !== null)
          const intersects = raycaster.intersectObjects(validPoints)

          // Reset previous hovered point
          if (hoveredPointRef.current) {
            hoveredPointRef.current.scale.setScalar(hoveredPointRef.current.userData.originalScale)
            if (rendererRef.current) {
              rendererRef.current.domElement.style.cursor = "grab"
            }
            // Hide tooltip
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "none"
            }
          }

          if (intersects.length > 0) {
            // Hover effect - scale up the point
            const hoveredPoint = intersects[0].object as THREE.Mesh
            hoveredPoint.scale.setScalar(1.8) // Larger hover effect
            hoveredPointRef.current = hoveredPoint
            if (rendererRef.current) {
              rendererRef.current.domElement.style.cursor = "pointer"
            }

            // Show tooltip
            if (tooltipRef.current) {
              const floatData = hoveredPoint.userData.floatData
              tooltipRef.current.innerHTML = `
                <div class="bg-white text-slate-800 p-2 rounded shadow-lg text-sm border border-slate-300">
                  <div class="font-semibold">Float ${floatData.id}</div>
                  <div>Lat: ${floatData.lat.toFixed(2)}°</div>
                  <div>Lon: ${floatData.lon.toFixed(2)}°</div>
                  <div>Last: ${new Date(floatData.lastReported).toLocaleDateString()}</div>
                </div>
              `
              tooltipRef.current.style.display = "block"
              tooltipRef.current.style.left = `${event.clientX + 10}px`
              tooltipRef.current.style.top = `${event.clientY - 10}px`
            }
          } else {
            hoveredPointRef.current = null
            // Hide tooltip
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "none"
            }
          }
        }
      }

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

    const handleMouseEnter = () => {
      isHoveredRef.current = true
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      // Reset any hovered point when leaving the globe area
      if (hoveredPointRef.current) {
        hoveredPointRef.current.scale.setScalar(hoveredPointRef.current.userData.originalScale)
        hoveredPointRef.current = null
      }
      // Hide tooltip
      if (tooltipRef.current) {
        tooltipRef.current.style.display = "none"
      }
      if (rendererRef.current) {
        rendererRef.current.domElement.style.cursor = "grab"
      }
    }

    renderer.domElement.style.cursor = "grab"
    renderer.domElement.addEventListener("mousedown", handleMouseDown, { passive: false })
    renderer.domElement.addEventListener("wheel", handleWheel, { passive: false })
    renderer.domElement.addEventListener("mouseenter", handleMouseEnter)
    renderer.domElement.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousemove", handleMouseMove, { passive: false })
    document.addEventListener("mouseup", handleMouseUp, { passive: false })
    renderer.domElement.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Only auto-rotate when not being hovered and not being dragged
      if (!controlsRef.current.isDragging && !isHoveredRef.current) {
        globe.rotation.y += 0.001
        // Update float points with auto-rotation
        floatPointsRef.current.forEach((point, index) => {
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

      // Handle pulsing animation for highlighted points (independent of rotation)
      floatPointsRef.current.forEach((point, index) => {
        if (point && floats[index]?.isHighlighted) {
          const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 1.2
          point.scale.setScalar(pulse)
        }
      })

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
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener("wheel", handleWheel)
        rendererRef.current.domElement.removeEventListener("mouseenter", handleMouseEnter)
        rendererRef.current.domElement.removeEventListener("mouseleave", handleMouseLeave)
      }
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update float highlighting
  useEffect(() => {
    floatPointsRef.current.forEach((point, index) => {
      if (point && floats[index] && point.material instanceof THREE.MeshPhongMaterial) {
        point.material.color.setHex(floats[index].isHighlighted ? 0xffff00 : 0x00ffff)
        point.material.opacity = floats[index].isHighlighted ? 1 : 0.9
        point.material.emissive.setHex(floats[index].isHighlighted ? 0x444400 : 0x004444)
        // Reset scale if this point is selected/highlighted
        if (floats[index].isHighlighted) {
          point.scale.setScalar(1.2) // Slightly larger for highlighted floats
        } else if (point !== hoveredPointRef.current) {
          point.scale.setScalar(1) // Normal size for non-highlighted, non-hovered floats
        }
      }
    })
  }, [floats])

  return <div ref={mountRef} className="w-full h-full" />
}
