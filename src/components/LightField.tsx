import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { StoreState, useStore } from "../store";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// set up light panels for environment map
export function LightField() {

    const backgroundMesh = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>(null)
    const envMap = useTexture('/day.jpg')
    const { iconHovered } = useStore((state: StoreState) => ({ iconHovered: state.iconHovered }));


    useFrame((state, delta) => {
        if (backgroundMesh.current) {
            if (iconHovered) {
                backgroundMesh.current.rotation.y += delta * .1
            } else {
                backgroundMesh.current.rotation.y += delta * .01
            }
        }
    })
    return (
        <>
            < Environment near={.1} far={100} resolution={256} frames={Infinity}>
                <mesh ref={backgroundMesh}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial map={envMap} side={THREE.BackSide} />
                </mesh>
                <mesh>
                    <boxGeometry args={[.02, 1, 1]} />
                    <meshBasicMaterial side={THREE.BackSide} />
                </mesh>
            </Environment >

        </>

    )
}



