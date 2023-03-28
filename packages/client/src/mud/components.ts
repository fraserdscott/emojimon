import { defineVoxelCoordComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Position: defineVoxelCoordComponent(world, {
    metadata: {
      contractId: "component.Position",
    },
  }),
};

export const clientComponents = {};
