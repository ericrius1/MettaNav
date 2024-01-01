import { Clone, useGLTF } from '@react-three/drei'
import { GroupProps, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FlakesTexture } from 'three-stdlib'
import { Mesh } from 'three'
import * as THREE from 'three'
import { useControls } from 'leva'
import { StoreState, useStore } from '../store'
import { motion } from 'framer-motion-3d'
import { damp } from 'maath/easing'

type ArrowProps = {
  direction: 'left' | 'right' | 'up' | 'down'
}

const flakesTexture = new FlakesTexture() as HTMLCanvasElement
const normalMap = new THREE.CanvasTexture(
  flakesTexture as HTMLCanvasElement,
  THREE.UVMapping,
  THREE.RepeatWrapping,
  THREE.RepeatWrapping
)
const normalScale = new THREE.Vector2(0.1, 0.1)
export function Arrow({ direction, ...props }: ArrowProps) {
  const { nodes } = useGLTF('/models/arrow.glb')
  const { normalRepeat } = useControls('Arrow', {
    normalRepeat: { value: 10, min: 1, max: 15, step: 1 },
  })
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const arrow = useRef<GroupProps>(null)
  const { width, height } = useThree((state) => state.viewport)
  const setIconHovered = useStore((state: StoreState) => state.setIconHovered)
  const [iconHovered, setIconHoveredLocal] = useState(false)
  console.log('rerender')
  const rotationSpeed = useRef(0)

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
  useLayoutEffect(
    function setArrowMaterial() {
      nodes.arrow.traverse((obj) => {
        if (obj instanceof Mesh) {
          obj.receiveShadow = obj.castShadow = true
        }
      })
    },
    [normalRepeat]
  )

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
    unhover: { scale: 1 },
  }

  useFrame((state, delta) => {
    if (material.current) {
      damp(material.current, 'envMapIntensity', iconHovered ? 3 : 0.7, 0.1, delta)
    }
    damp(rotationSpeed, 'current', iconHovered ? 0.001 : 0, 0, delta, 1)

    if (arrow.current && arrow.current.rotation) {
      //@ts-ignore
      arrow.current.rotation.z += rotationSpeed.current
    }
  })

  return (
    <motion.group
      {...props}
      ref={arrow}
      position={[direction === 'right' ? -width / 2.5 : width / 2.5, -height / 2.5, 0]}
      onPointerEnter={hoverStart}
      onPointerLeave={hoverEnd}
      variants={arrowVariants}
      whileHover='hover'
      initial='unhover'
    >
      <Clone object={nodes.arrow}>
        <meshStandardMaterial
          normalMap={normalMap}
          normalMap-repeat={normalRepeat}
          normalScale={normalScale}
          roughness={0.1}
          color={'orange'}
          metalness={1}
          ref={material}
        />
      </Clone>
    </motion.group>
  )
}
useGLTF.preload('/models/arrow.glb')
