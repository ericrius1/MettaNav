import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  PresentationControls,
  RandomizedLight,
  Sky,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import * as THREE from 'three'
import { Frame } from './components/Frame'
import { DeepArt } from './components/DeepArt'
import { Arrow } from './components/Arrow'
import { LightField } from './components/LightField'

function Scene() {
  const { performance } = useControls('Monitoring', {
    performance: false,
  })

  const cubeRef = useRef<Mesh<BoxGeometry, MeshBasicMaterial>>(null)

  return (
    <>
      <PerspectiveCamera
        makeDefault
        fov={55}
        near={0.1}
        far={10000}
        position={[0, 0, 5]}
      />
      {/* <OrbitControls /> */}
      {performance && <Perf position='top-left' />}

      {/* <Environment preset="city" /> */}
      <LightField />
      <Arrow direction='left' />
      <Arrow direction='right' />

      {/* <Frame id="01" name="dinasour" position-y={-5}>
        <DeepArt imagePath="/image.jpg" depthMapPath="/depth.jpg" />
      </Frame> */}
    </>
  )
}

export { Scene }
