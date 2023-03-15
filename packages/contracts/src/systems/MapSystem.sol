// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { MapComponent, ID as MapComponentID } from "components/MapComponent.sol";
import { Map } from "../components/MapComponent.sol";

uint256 constant ID = uint256(keccak256("system.Map"));

contract MapSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (int32[] memory xs, int32[] memory ys) = abi.decode(args, (int32[], int32[]));
    return executeTyped(xs, ys);
  }

  function executeTyped(int32[] memory xs, int32[] memory ys) public returns (bytes memory) {
    MapComponent mapComponent = MapComponent(getAddressById(components, MapComponentID));

    mapComponent.set(world.getUniqueEntityId(), Map(xs, ys));
  }
}
