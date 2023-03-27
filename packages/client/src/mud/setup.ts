import { setupMUDNetwork } from "@latticexyz/std-client";
import { SystemTypes } from "contracts/types/SystemTypes";
import { config } from "./config";
import { components, clientComponents } from "./components";
import { world } from "./world";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import {
  createFaucetService,
  GodID as singletonEntityId,
} from "@latticexyz/network";
import { ethers } from "ethers";
import { EntityID } from "@latticexyz/recs";
import { Coord, Input } from "../Game";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export const setup = async () => {
  const result = await setupMUDNetwork<typeof components, SystemTypes>(
    config,
    world,
    components,
    SystemAbis,
    {
      fetchSystemCalls: true,
    }
  );

  result.startSync();

  // For LoadingState updates
  const singletonEntity = world.registerEntity({ id: singletonEntityId });

  // Register player entity
  const address = result.network.connectedAddress.get();
  if (!address) throw new Error("Not connected");

  const playerEntityId = address as EntityID;
  const playerEntity = world.registerEntity({ id: playerEntityId });

  // Request drip from faucet
  if (!config.devMode && config.faucetServiceUrl) {
    const faucet = createFaucetService(config.faucetServiceUrl);
    console.info("[Dev Faucet]: Player Address -> ", address);

    const requestDrip = async () => {
      const balance = await result.network.signer.get()?.getBalance();
      console.info(`[Dev Faucet]: Player Balance -> ${balance}`);
      const playerIsBroke = balance?.lte(ethers.utils.parseEther("1"));
      console.info(`[Dev Faucet]: Player is broke -> ${playerIsBroke}`);
      if (playerIsBroke) {
        console.info("[Dev Faucet]: Dripping funds to player");
        // Double drip
        address &&
          (await faucet?.dripDev({ address })) &&
          (await faucet?.dripDev({ address }));
      }
    };

    requestDrip();
    // Request a drip every 20 seconds
    setInterval(requestDrip, 20000);
  }

  const moveTo = async (inputs: Array<Input>) => {
    const tx = await result.systems["system.Set"].executeTyped(
      inputs.map((i) => i.timestamp),
      inputs.map((i) => i.direction)
    );
    await tx.wait();
  };

  const upload = async (goal: Coord, inputs: Array<Coord>) => {
    const tx = await result.systems["system.Upload"].executeTyped(
      goal.x,
      goal.y,
      inputs.map((i) => i.x),
      inputs.map((i) => i.y)
    );
    await tx.wait();
  };

  return {
    ...result,
    world,
    singletonEntityId,
    singletonEntity,
    playerEntityId,
    playerEntity,
    components: {
      ...result.components,
      ...clientComponents,
    },
    api: {
      moveTo,
      upload,
    },
  };
};
