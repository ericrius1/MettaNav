import { useGLTF } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useRef } from "react"
import { FlakesTexture } from 'three-stdlib'
import { MeshStandardMaterial, Mesh } from "three"
import * as THREE from 'three'

type ArrowProps = {
    direction: 'left' | 'right' | 'up' | 'down',
}

export function Arrow({ direction, ...props }: ArrowProps) {
    const { scene, materials } = useGLTF('/models/arrow.glb')
    const { camera } = useThree()
    const arrow = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    useLayoutEffect(function setArrowDirection() {
        if (direction === 'left') {
            scene.rotation.y = Math.PI / 2
        }
        if (direction === 'right') {
            scene.rotation.y = -Math.PI / 2
        }
        if (direction === 'up') {
            scene.rotation.x = Math.PI / 2
        }
        if (direction === 'down') {
            scene.rotation.x = -Math.PI / 2
        }
    })

    useLayoutEffect(function setArrowMaterial() {
        scene.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.receiveShadow = obj.castShadow = true;
            }
        });
        if (materials.arrow instanceof THREE.MeshStandardMaterial) {
            materials.arrow.envMapIntensity = 0.3
            materials.arrow.color.set('orange')
            materials.arrow.normalMap = new THREE.CanvasTexture(new FlakesTexture(), THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
            materials.arrow.normalMap.repeat.set(40, 40);
            materials.arrow.normalScale.set(0.1, 0.1);
        }

        // camera.add(arrow.current);
        return () => {
            // Remove the object from the camera when the component unmounts
            // camera.remove(arrow.current);
        };
    }, [camera])

    return (
        <group {...props} ref={arrow} position={[0, 0, 0]}>
            <primitive object={scene} />
            {/* <pointLight position={[2, 10, 10]} intensity={100} distance={1000} /> */}
        </group>

    )
}