// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/Component.sol";

enum Direction {
  Up,
  Down,
  Left,
  Right
}

struct Inputs {
  uint256[] timestamps;
  Direction[] directions;
}

uint256 constant ID = uint256(keccak256("component.Inputs"));

contract InputsComponent is BareComponent {
  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](2);
    values = new LibTypes.SchemaValue[](2);

    keys[0] = "timestamps";
    values[0] = LibTypes.SchemaValue.UINT256_ARRAY;

    keys[1] = "directions";
    values[1] = LibTypes.SchemaValue.UINT8_ARRAY;
  }

  function set(uint256 entity, Inputs calldata value) public {
    set(entity, abi.encode(value.timestamps, value.directions));
  }

  function getValue(uint256 entity) public view returns (Inputs memory) {
    (uint256[] memory timestamps, Direction[] memory directions) = abi.decode(
      getRawValue(entity),
      (uint256[], Direction[])
    );
    return Inputs(timestamps, directions);
  }

  function getEntitiesWithValue(Inputs calldata inputs) public view returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(inputs));
  }
}
