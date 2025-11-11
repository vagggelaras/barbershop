import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function RotatingScissors() {
    const { scene } = useGLTF('/scissors.glb')
    const meshRef = useRef()

    // Εφαρμόζουμε χρυσό μεταλλικό material
    useEffect(() => {
        if (scene) {
            const goldMaterial = new THREE.MeshStandardMaterial({
                color: '#FFD700', // χρυσό χρώμα
                metalness: 0.9, // πολύ μεταλλικό
                roughness: 0.2, // λίγο τραχύ για ρεαλισμό
            })

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = goldMaterial
                }
            })
        }
    }, [scene])

    // Αυτόματη περιστροφή - απαλή περιστροφή γύρω από τον Y άξονα
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={16}
            position={[4, -1, -2]}
            rotation={[0, 1, .9]} // Μύτη προς τα πάνω
        />
    )
}

export default function Scissors3D() {
    return (
        <div style={{ width: '100%', height: '80vh', position: 'relative', zIndex: 1 }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />

                {/* Φωτισμός από την πλευρά του χρήστη */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 5, 8]} intensity={1.8} />
                <directionalLight position={[3, 2, 6]} intensity={0.8} />
                <pointLight position={[0, 3, 7]} intensity={1.2} color="#FFD700" />

                <RotatingScissors />
            </Canvas>
        </div>
    )
}

// Preload το model για καλύτερη performance
useGLTF.preload('/scissors.glb')