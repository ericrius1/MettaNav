import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ACESFilmicToneMapping, sRGBEncoding } from 'three'
import { Scene } from './Scene'
import { PerspectiveCamera } from '@react-three/drei'
import './styles/global.css'

function Main() {
  return (
    <div className='main'>
      <Leva
        collapsed={false}
        oneLineLabels={false}
        flat={true}
        theme={{
          sizes: {
            titleBarHeight: '28px',
          },
          fontSizes: {
            root: '10px',
          },
        }}
      />
      <Canvas
        dpr={[1, 2]}

        gl={{
          localClippingEnabled: true,
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
        }}

        shadows
      >
        <PerspectiveCamera makeDefault fov={55} near={.1} far={10000} position={[0, 0, 5]} />
        <Scene />
      </Canvas>
    </div >
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
