// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { QueryType } from "solecs/interfaces/Query.sol";
import { IWorld, WorldQueryFragment } from "solecs/World.sol";
import { ID as PositionComponentID, VoxelCoord } from "components/PositionComponent.sol";

library LibMap {
  function distance(VoxelCoord memory from, VoxelCoord memory to) internal pure returns (int32) {
    int32 deltaX = from.x > to.x ? from.x - to.x : to.x - from.x;
    int32 deltaY = from.y > to.y ? from.y - to.y : to.y - from.y;
    int32 deltaZ = from.z > to.z ? from.z - to.z : to.z - from.z;
    return deltaX + deltaY + deltaZ;
  }
}
