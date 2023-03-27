import * as THREE from "three";
import { useRef } from "react";
import { Canvas, ThreeElements } from "@react-three/fiber";
import { Coord } from "./Game";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

function Ghost(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[1]} />
    </mesh>
  );
}

function Player(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export const Board3D = ({
  position,
  positions,
  colliders,
}: {
  position: Coord;
  positions: Array<Coord>;
  colliders: Array<Coord>;
}) => {
  return (
    <Canvas className="border-2 border-gray-100">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Player position={[position.x, position.y, 0]} />
      {colliders.map((c, i) => (
        <Box key={i} position={[c.x, c.y, 0]} />
      ))}
      {positions.map((c, i) => (
        <Ghost key={i} position={[c.x, c.y, 0]} />
      ))}
    </Canvas>
  );
};
