import { Center, Clone, useGLTF } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useRef } from "react"
import { FlakesTexture } from 'three-stdlib'
import { MeshStandardMaterial, Mesh } from "three"
import * as THREE from 'three'
import { useControls } from "leva"

type ArrowProps = {
    direction: 'left' | 'right' | 'up' | 'down',
}

export function Arrow({ direction, ...props }: ArrowProps) {
    const { scene, materials } = useGLTF('/models/arrow.glb')
    const { camera } = useThree()
    const arrow = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    const { width, height } = useThree((state) => state.viewport)

    const { normalRepeat } = useControls('Arrow', {
        normalRepeat: { value: 10, min: 1, max: 100, step: 1 },
    })
    useLayoutEffect(function setArrowDirection() {
        if (direction === 'left') {
            arrow.current.rotation.y = Math.PI / 2
        }
        if (direction === 'right') {
            arrow.current.rotation.y = -Math.PI / 2
        }
        if (direction === 'up') {
            arrow.current.rotation.x = Math.PI / 2
        }
        if (direction === 'down') {
            arrow.current.rotation.x = -Math.PI / 2
        }
    })

    useLayoutEffect(function setArrowMaterial() {
        scene.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.receiveShadow = obj.castShadow = true;
            }
        });
        if (materials.arrow instanceof THREE.MeshStandardMaterial) {
            // materials.arrow.envMapIntensity = 0.3
            materials.arrow.color.set('orange')
            materials.arrow.normalMap = new THREE.CanvasTexture(new FlakesTexture() as HTMLCanvasElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
            materials.arrow.normalMap.repeat.set(normalRepeat, normalRepeat);
            materials.arrow.normalScale.set(0.1, 0.1);
            materials.arrow.roughness = .1
        }

    }, [normalRepeat])

    useEffect(() => {

    }, [camera])

    return (

        <group {...props} ref={arrow} position={[direction === 'right' ? -width / 2.5 : width / 2.5, -height / 2.5, 0]}>
            <Clone object={scene} />
            {/* <primitive object={scene} /> */}
            {/* <pointLight position={[2, 10, 10]} intensity={100} distance={1000} /> */}
        </group>


    )
}