import { defineComponent, Type } from "@latticexyz/recs";
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
  Map: defineComponent(
    world,
    {
      xs: Type.NumberArray,
      ys: Type.NumberArray,
    },
    {
      id: "Map",
      metadata: { contractId: "component.Map" },
    }
  ),
};

export const clientComponents = {};
