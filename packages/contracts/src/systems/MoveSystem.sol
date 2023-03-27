// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { PositionComponent, ID as PositionComponentID, VoxelCoord } from "components/PositionComponent.sol";
import { LibMap } from "libraries/LibMap.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    return executeTyped(abi.decode(args, (VoxelCoord)));
  }

  function executeTyped(VoxelCoord memory coord) public returns (bytes memory) {
    uint256 entityId = addressToEntity(msg.sender);

    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
    if (position.has(entityId)) {
      require(LibMap.distance(position.getValue(entityId), coord) == 1, "can only move to adjacent spaces");
    } else {
      require(LibMap.distance(VoxelCoord(0, 0, 0), coord) == 1, "can only move to adjacent spaces");
    }
    position.set(entityId, coord);
  }
}
