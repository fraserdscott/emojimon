import * as THREE from "three";
import { useRef } from "react";
import { Canvas, ThreeElements, useThree } from "@react-three/fiber";
import { Coord } from "./Game";
import { Level } from "./Start";

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

function Goal(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[0.5, 0.5, 10]} />
      <meshStandardMaterial color="green" />
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
  level,
}: {
  position: Coord;
  positions: Array<Coord>;
  level: Level;
}) => {
  return (
    <Canvas className="border-2 border-gray-100">
      <Scene position={position} positions={positions} level={level} />
    </Canvas>
  );
};

function Scene({
  position,
  positions,
  level,
}: {
  position: Coord;
  positions: Array<Coord>;
  level: Level;
}) {
  useThree(({ camera }) => {
    camera.rotation.set(1, 0, 0);
    camera.position.set(position.x, position.y - 5, 5);
  });

  return (
    <group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Player position={[position.x, position.y, 0]} />
      <Goal position={[level.goal.x, level.goal.y, 0]} />
      {level.colliders.map((c, i) => (
        <Box key={i} position={[c.x, c.y, 0]} />
      ))}
      {positions.map((c, i) => (
        <Ghost key={i} position={[c.x, c.y, 0]} />
      ))}
    </group>
  );
}
