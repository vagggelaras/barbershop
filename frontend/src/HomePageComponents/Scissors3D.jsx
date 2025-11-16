import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import '../HomePageStyles/Scissors3D.css'

function RotatingScissors() {
    const { scene } = useGLTF('/scissors.glb')
    const meshRef = useRef()

    // Εφαρμόζουμε χρυσό μεταλλικό material
    useEffect(() => {
        if (scene) {
            const color = new THREE.MeshStandardMaterial({
                color: 'honeydew', // χρώμα
                metalness: 0.85, // πολύ μεταλλικό
                roughness: 0.1, // λίγο τραχύ για ρεαλισμό
            })

            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = color
                }
            })
        }
    }, [scene])

    // Περιστροφή μπρος-πίσω (oscillating rotation)
    useFrame(({ clock }) => {
        if (meshRef.current) {
            // Χρησιμοποιούμε sin για smooth back-and-forth rotation
            const time = clock.getElapsedTime()
            meshRef.current.rotation.y = Math.sin(time * 0.3) * Math.PI * .2 // Περιστρέφεται μπρος-πίσω
        }
    })

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={13}
            position={[0, 0, 0]}
            rotation={[-0.2, 1, .8]} // Αρχική θέση
        />
    )
}

export default function Scissors3D() {
    return (
        <div className="scissors-container">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />

                <ambientLight intensity={1} />
                <directionalLight position={[0, 5, 8]} intensity={1.8} />
                <directionalLight position={[3, 2, 6]} intensity={0.8} />
                <pointLight position={[0, 3, 7]} intensity={2} color="#FFD700" />

                <RotatingScissors />
            </Canvas>
        </div>
    )
}

// Preload το model για καλύτερη performance
useGLTF.preload('/scissors.glb')