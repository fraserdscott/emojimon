import { useEntityQuery } from "@latticexyz/react";
import {
  getComponentEntities,
  getComponentValueStrict,
  Has,
} from "@latticexyz/recs";
import { useEffect, useState } from "react";
import { Board3D } from "./Board3D";
import { useMUD } from "./MUDContext";

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export interface Coord {
  x: number;
  y: number;
}

export interface Input {
  timestamp: number;
  direction: Direction;
}

const processInput = (
  colliders: Array<Coord>,
  position: Coord,
  direction: Direction
) => {
  let force: Coord = { x: 0, y: 0 };

  if (direction === Direction.Up) {
    force.y = 1;
  } else if (direction === Direction.Down) {
    force.y = -1;
  } else if (direction === Direction.Left) {
    force.x = -1;
  } else {
    force.x = 1;
  }

  const newPosition = {
    x: position.x + force.x,
    y: position.y + force.y,
  };

  const blocked = colliders.some(
    (c) => c.x === newPosition.x && c.y === newPosition.y
  );

  if (blocked) {
    return position;
  } else {
    return newPosition;
  }
};

export const Game = ({ colliders }: { colliders: Array<Coord> }) => {
  const {
    api: { moveTo },
    components: { Inputs },
  } = useMUD();

  const [recording, setRecording] = useState(false);
  const [start, setStart] = useState(0);
  const [localPosition, setLocalPosition] = useState<Coord>({ x: 0, y: 0 });
  const [localInputs, setLocalInputs] = useState<Array<Input>>([]);
  const [ghostIndices, setGhostIndices] = useState<Array<number>>([]);
  const [ghostPositions, setGhostPositions] = useState<Array<Coord>>([]);
  const [ghostInputs, setGhostInputs] = useState<Array<Array<Input>>>([]);

  const ghostEntities = useEntityQuery([Has(Inputs)]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let direction: Direction;

      if (["w", "a", "s", "d"].includes(e.key)) {
        if (e.key === "w") {
          direction = Direction.Up;
        } else if (e.key === "s") {
          direction = Direction.Down;
        } else if (e.key === "a") {
          direction = Direction.Left;
        } else {
          direction = Direction.Right;
        }

        setLocalPosition(processInput(colliders, localPosition, direction));
        setLocalInputs([
          ...localInputs,
          {
            timestamp: Date.now() - start,
            direction,
          },
        ]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [localInputs, ghostPositions, start]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      for (let z = 0; z < ghostInputs.length; z++) {
        const index = ghostIndices[z];
        const inputs = ghostInputs[z];

        for (let i = index; i < inputs.length; i++) {
          const elapsed = Date.now() - start;
          if (inputs[i].timestamp <= elapsed) {
            const place = processInput(
              colliders,
              ghostPositions[z],
              inputs[i].direction
            );

            const positionsCopy = ghostPositions.slice();
            positionsCopy[z] = place;
            setGhostPositions(positionsCopy);

            const indicesCopy = ghostIndices.slice();
            indicesCopy[z] = index + 1;
            setGhostIndices(indicesCopy);
          } else {
            break;
          }
        }
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [ghostInputs, ghostIndices, ghostPositions, start]);

  return (
    <div className="text-center w-full h-full">
      <Board3D
        colliders={colliders}
        position={recording ? localPosition : { x: 10000, y: 10000 }}
        positions={recording ? ghostPositions : []}
      />
      {recording ? (
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            moveTo(localInputs);
            setRecording(false);
          }}
        >
          STOP
        </button>
      ) : (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // fetch all past ghosts
            const pastInputs: Array<Array<Input>> = [];
            for (const entity of getComponentEntities(Inputs)) {
              const input = getComponentValueStrict(Inputs, entity);

              pastInputs.push(
                input.timestamps.map((t, i) => ({
                  timestamp: t,
                  direction: input.directions[i],
                }))
              );
            }

            const N = pastInputs.length;

            setRecording(true);
            setStart(Date.now());
            setLocalInputs([]);
            setLocalPosition({ x: 0, y: 0 });

            setGhostInputs(pastInputs);
            setGhostIndices(Array(N).fill(0));
            setGhostPositions(Array(N).fill({ x: 0, y: 0 }));
          }}
        >
          START
        </button>
      )}
      <div>There are {ghostEntities.length} ghosts.</div>
    </div>
  );
};
