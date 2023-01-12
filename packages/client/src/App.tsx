import { SyncState } from "@latticexyz/network";
import { useComponentValue } from "@latticexyz/react";
import { GameBoard } from "./GameBoard";
import { useMUD } from "./MUDContext";

export const App = () => {
  const {
    components: { LoadingState },
    singletonEntity,
  } = useMUD();

  const loadingState = useComponentValue(singletonEntity, LoadingState, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
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
