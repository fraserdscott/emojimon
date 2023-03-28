import * as THREE from "three";
import { useRef } from "react";
import { Canvas, Color, ThreeElements, useThree } from "@react-three/fiber";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "./MUDContext";
import { useKeyboardMovement } from "./useKeyboardMovement";

function Plane(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[10, 5, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function Player(props: ThreeElements["mesh"] & { color: Color }) {
  const ref = useRef<THREE.Mesh>(null!);
  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

function Scene() {
  const {
    world,
    components: { Position },
    playerEntity,
  } = useMUD();

  useKeyboardMovement();

  const playerPosition = useComponentValue(Position, playerEntity);
  const otherPlayers = useEntityQuery([Has(Position)])
    .filter((entity) => entity !== playerEntity)
    .map((entity) => {
      const position = getComponentValueStrict(Position, entity);
      return {
        entity,
        position,
      };
    });

  useThree(({ camera }) => {
    if (playerPosition) {
      camera.position.set(
        playerPosition.x - 5,
        playerPosition.y + 5,
        playerPosition.z + 5
      );
    } else {
      camera.position.set(-5, 5, 5);
    }
    camera.rotation.order = "YXZ";
    camera.rotation.y = -Math.PI / 4;
    camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
  });

  return (
    <group>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Plane position={[0, -5, 0]} />
      {playerPosition ? (
        <Player
          color={"red"}
          position={[playerPosition.x, playerPosition.y, playerPosition.z]}
        />
      ) : null}
      {otherPlayers.map((p, i) => (
        <Player
          key={i}
          color={Math.floor(
            (parseInt(world.entities[p.entity]) * 123231) % 16777215
          )}
          position={[p.position.x, p.position.y, p.position.z]}
        />
      ))}
    </group>
  );
}

export const GameBoard = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
};
