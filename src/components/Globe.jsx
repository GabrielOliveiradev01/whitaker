import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const R = 1.6

function latLngToVec3(lat, lng, radius = R) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

// Major airports (lat, lng) — GRU, JFK, LHR, DXB, HND, CDG, SIN, LAX, GIG, MIA
const AIRPORTS = [
  [-23.43, -46.47],
  [40.64, -73.78],
  [51.47, -0.45],
  [25.25, 55.36],
  [35.55, 139.78],
  [49.0, 2.55],
  [1.36, 103.99],
  [33.94, -118.4],
  [-22.81, -43.25],
  [25.79, -80.29],
  [-33.94, 151.18],
  [19.43, -99.07],
]

// Curated routes between airport indices.
const ROUTES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 6],
  [5, 3],
  [7, 1],
  [8, 5],
  [9, 0],
  [2, 5],
  [10, 6],
  [11, 7],
]

function Dots() {
  // Build a fibonacci sphere of small points to suggest a globe surface.
  const positions = useMemo(() => {
    const N = 1400
    const pts = new Float32Array(N * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = golden * i
      pts[i * 3] = Math.cos(theta) * r * R
      pts[i * 3 + 1] = y * R
      pts[i * 3 + 2] = Math.sin(theta) * r * R
    }
    return pts
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.013}
        color="#6f6f78"
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

function Markers() {
  const vecs = useMemo(
    () => AIRPORTS.map(([la, ln]) => latLngToVec3(la, ln, R * 1.005)),
    []
  )
  return (
    <group>
      {vecs.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color="#e6c789" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Arc({ from, to, speed = 0.35, offset = 0 }) {
  const ref = useRef()
  const headRef = useRef()

  const { curve, geometry } = useMemo(() => {
    const start = latLngToVec3(...from, R * 1.01)
    const end = latLngToVec3(...to, R * 1.01)
    const mid = start.clone().add(end).multiplyScalar(0.5)
    const dist = start.distanceTo(end)
    mid.normalize().multiplyScalar(R + dist * 0.5)
    const c = new THREE.QuadraticBezierCurve3(start, mid, end)
    const pts = c.getPoints(60)
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    return { curve: c, geometry: g }
  }, [from, to])

  useFrame((state) => {
    const t = (state.clock.elapsedTime * speed + offset) % 1
    if (headRef.current) {
      const p = curve.getPoint(t)
      headRef.current.position.copy(p)
      const scale = 0.025 + Math.sin(t * Math.PI) * 0.02
      headRef.current.scale.setScalar(scale / 0.025)
    }
  })

  return (
    <group ref={ref}>
      <line geometry={geometry}>
        <lineBasicMaterial
          color="#c8a96a"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </line>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshBasicMaterial color="#fff0cf" toneMapped={false} />
      </mesh>
    </group>
  )
}

function Atmosphere() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[R, 48, 48]} />
      <meshBasicMaterial
        color="#c8a96a"
        transparent
        opacity={0.06}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  )
}

function World() {
  const group = useRef()
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08
  })

  return (
    <group ref={group} rotation={[0.35, 0, 0.1]}>
      <mesh>
        <sphereGeometry args={[R * 0.99, 48, 48]} />
        <meshPhongMaterial
          color="#0b0b0d"
          emissive="#0a0a0c"
          shininess={8}
          specular="#2a2a30"
        />
      </mesh>
      <Dots />
      <Markers />
      {ROUTES.map(([a, b], i) => (
        <Arc
          key={i}
          from={AIRPORTS[a]}
          to={AIRPORTS[b]}
          speed={0.18 + (i % 4) * 0.05}
          offset={(i * 0.13) % 1}
        />
      ))}
    </group>
  )
}

export default function Globe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 3, 5]} intensity={1.2} color="#e6c789" />
      <pointLight position={[-5, -2, -3]} intensity={0.4} color="#5b6cff" />
      <Suspense fallback={null}>
        <World />
        <Atmosphere />
      </Suspense>
    </Canvas>
  )
}
