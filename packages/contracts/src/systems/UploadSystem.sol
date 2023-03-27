// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { Colliders, CollidersComponent, ID as CollidersComponentID } from "components/CollidersComponent.sol";
import { VoxelCoord, GoalComponent, ID as GoalComponentID } from "components/GoalComponent.sol";

uint256 constant ID = uint256(keccak256("system.Upload"));

contract UploadSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (int32 x, int32 y, int32[] memory xs, int32[] memory ys) = abi.decode(args, (int32, int32, int32[], int32[]));
    return executeTyped(x, y, xs, ys);
  }

  function executeTyped(int32 x, int32 y, int32[] memory xs, int32[] memory ys) public returns (bytes memory) {
    GoalComponent goalComponent = GoalComponent(getAddressById(components, GoalComponentID));
    CollidersComponent collidersComponent = CollidersComponent(getAddressById(components, CollidersComponentID));

    uint256 entityId = world.getUniqueEntityId();
    goalComponent.set(entityId, VoxelCoord(x, y, 0));
    collidersComponent.set(entityId, Colliders(xs, ys));
  }
}
