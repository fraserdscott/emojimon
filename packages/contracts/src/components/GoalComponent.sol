// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/VoxelCoordComponent.sol";

uint256 constant ID = uint256(keccak256("component.Goal"));

contract GoalComponent is VoxelCoordComponent {
  constructor(address world) VoxelCoordComponent(world, ID) {}
}
