import { Clone, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef, useState } from "react"
import { FlakesTexture } from 'three-stdlib'
import { Mesh } from "three"
import * as THREE from 'three'
import { useControls } from "leva"
import { StoreState, useStore } from '../store'
import { motion } from "framer-motion-3d"
import { damp } from "maath/easing"

type ArrowProps = {
    direction: 'left' | 'right' | 'up' | 'down',
}

export function Arrow({ direction, ...props }: ArrowProps) {
    const { nodes, materials } = useGLTF('/models/arrow.glb')
    const material = useRef<THREE.MeshStandardMaterial>(null)
    const arrow = useRef<THREE.Group<THREE.Object3DEventMap>>(null)
    const { width, height } = useThree((state) => state.viewport)
    const setIconHovered = useStore((state: StoreState) => state.setIconHovered);
    const [iconHovered, setIconHoveredLocal] = useState(false)
    const { normalRepeat } = useControls('Arrow', {
        normalRepeat: { value: 10, min: 1, max: 15, step: 1 },
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
        nodes.arrow.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.receiveShadow = obj.castShadow = true;
            }
        });
        if (materials.arrow instanceof THREE.MeshStandardMaterial) {
            materials.arrow.color.set('orange')
            materials.arrow.normalMap = new THREE.CanvasTexture(new FlakesTexture() as HTMLCanvasElement, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
            materials.arrow.normalMap.repeat.set(normalRepeat, normalRepeat);
            materials.arrow.normalScale.set(.1, .1);
            materials.arrow.roughness = 0.1
            materials.arrow.metalness = 1
        }
    }, [normalRepeat, nodes.arrow])

    function hoverStart() {
        setIconHovered(true)
        setIconHoveredLocal(true)
    }

    function hoverEnd() {
        setIconHovered(false)
        setIconHoveredLocal(false)
    }

    const arrowVariants = {
        hover: { scale: 1.2 },
        unhover: { scale: 1 }
    }

    useFrame((state, delta) => {
        damp(material.current, 'envMapIntensity', iconHovered ? 5 : .5, 0.1, delta)

    })

    return (
        <motion.group {...props} ref={arrow} position={[direction === 'right' ? -width / 2.5 : width / 2.5, -height / 2.5, 0]} onPointerEnter={hoverStart} onPointerLeave={hoverEnd} variants={arrowVariants} whileHover="hover" initial="unhover">
            <Clone object={nodes.arrow}>
                <meshStandardMaterial {...materials.arrow} ref={material} />
            </Clone>
        </motion.group>
    )
}