import { defineComponent, Type } from "@latticexyz/recs";
import { defineVoxelCoordComponent } from "@latticexyz/std-client";
import { world } from "./world";

export const components = {
  Inputs: defineComponent(
    world,
    {
      timestamps: Type.NumberArray,
      directions: Type.NumberArray,
    },
    {
      id: "Inputs",
      metadata: { contractId: "component.Inputs" },
    }
  ),
  Goal: defineVoxelCoordComponent(world, {
    id: "Goal",
    metadata: { contractId: "component.Goal" },
  }),
  Colliders: defineComponent(
    world,
    {
      xs: Type.NumberArray,
      ys: Type.NumberArray,
    },
    {
      id: "Colliders",
      metadata: { contractId: "component.Colliders" },
    }
  ),
};

export const clientComponents = {};
