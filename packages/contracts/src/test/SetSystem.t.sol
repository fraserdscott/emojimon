// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Deploy } from "./Deploy.sol";
import "std-contracts/test/MudTest.t.sol";
import { Direction, SetSystem, ID as SetSystemID } from "../systems/SetSystem.sol";

contract SetSystemTest is MudTest {
  constructor() MudTest(new Deploy()) {}

  function testSet(uint256 n) public {
    vm.assume(n < 100000);

    uint256[] memory timestamps = new uint256[](n);
    Direction[] memory directions = new Direction[](n);

    SetSystem(system(SetSystemID)).executeTyped(timestamps, directions);
  }
}
