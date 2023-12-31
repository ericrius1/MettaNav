import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";

// set up light panels for environment map
export function LightField() {


    const envMap = useTexture('/day.jpg')
    return (
        <>
            < Environment near={.1} far={100} resolution={256} >
                {/* <mesh >
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial map={envMap} side={THREE.BackSide} />
                </mesh> */}
                <mesh>
                    <boxGeometry args={[.02, 1, 1]} />
                    <meshBasicMaterial side={THREE.BackSide} />
                </mesh>
            </Environment >

        </>

    )
}



