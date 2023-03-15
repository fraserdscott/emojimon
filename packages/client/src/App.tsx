import { SyncState } from "@latticexyz/network";
import { useComponentValueStream } from "@latticexyz/std-client";
import { useMUD } from "./MUDContext";
import { Start } from "./Start";

export const App = () => {
  const {
    components: { LoadingState },
    singletonEntity,
  } = useMUD();

  const loadingState = useComponentValueStream(
    LoadingState,
    singletonEntity
  ) ?? {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  };

  return (
    <div>
      {loadingState.state !== SyncState.LIVE ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        <Start />
      )}
    </div>
  );
};
