// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { InputsComponent, ID as InputsComponentID } from "components/InputsComponent.sol";
import { Direction } from "../components/InputsComponent.sol";
import { Inputs } from "../components/InputsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Set"));

contract SetSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256[] memory timestamps, Direction[] memory directions) = abi.decode(args, (uint256[], Direction[]));
    return executeTyped(timestamps, directions);
  }

  function executeTyped(uint256[] memory timestamps, Direction[] memory directions) public returns (bytes memory) {
    InputsComponent inputsComponent = InputsComponent(getAddressById(components, InputsComponentID));

    inputsComponent.set(world.getUniqueEntityId(), Inputs(timestamps, directions));
  }
}
