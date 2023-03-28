import { SyncState } from "@latticexyz/network";
import { useComponentValue } from "@latticexyz/react";
import { useMUD } from "./MUDContext";
import { GameBoard } from "./GameBoard";

export const App = () => {
  const {
    components: { LoadingState },
    singletonEntity,
  } = useMUD();

  const loadingState = useComponentValue(LoadingState, singletonEntity) ?? {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  };

  const {
    components: { Position },
    playerEntity,
  } = useMUD();

  const playerPosition = useComponentValue(Position, playerEntity);

  console.log(playerPosition);

  return (
    <div className="w-screen h-screen">
      {loadingState.state !== SyncState.LIVE ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        <GameBoard />
      )}
    </div>
  );
};
