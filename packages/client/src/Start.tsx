import { useEntityQuery } from "@latticexyz/react";
import { getComponentValueStrict, Has } from "@latticexyz/recs";
import { Coord, Game, Input, processInput } from "./Game";
import { useMUD } from "./MUDContext";

export interface Level {
  goal: Coord;
  colliders: Array<Coord>;
}

const coordsEqual = (a: Coord, b: Coord) => {
  return a.x === b.x && a.y === b.y;
};

export const calculateTime = (level: Level, inputs: Array<Input>) => {
  let position: Coord = { x: 0, y: 0 };

  for (let i = 0; i < inputs.length; i++) {
    position = processInput(level.colliders, position, inputs[i].direction);

    if (coordsEqual(position, level.goal)) {
      return inputs[i].timestamp;
    }
  }
};

export const Start = () => {
  const {
    api: { upload },
    components: { Colliders, Goal },
  } = useMUD();

  const entities = useEntityQuery([Has(Colliders)]);

  const levels: Array<Level> = entities.map((entity) => {
    const g = getComponentValueStrict(Goal, entity);
    const cs = getComponentValueStrict(Colliders, entity);

    return {
      goal: g,
      colliders: cs.xs.map((x, i) => ({
        x,
        y: cs.ys[i],
      })),
    };
  });

  return (
    <div className="flex h-96 w-full">
      {levels.length > 0 ? (
        <Game level={levels[0]} />
      ) : (
        <div className="w-full text-center">
          <div>no levels!</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() =>
              upload({ x: 3, y: 6 }, [
                { x: 2, y: 2 },
                { x: 2, y: 3 },
                { x: -1, y: -1 },
              ])
            }
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};
