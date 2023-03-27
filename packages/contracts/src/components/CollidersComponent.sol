// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "solecs/Component.sol";

struct Colliders {
  int32[] xs;
  int32[] ys;
}

uint256 constant ID = uint256(keccak256("component.Colliders"));

contract CollidersComponent is BareComponent {
  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](2);
    values = new LibTypes.SchemaValue[](2);

    keys[0] = "xs";
    values[0] = LibTypes.SchemaValue.INT32_ARRAY;

    keys[1] = "ys";
    values[1] = LibTypes.SchemaValue.INT32_ARRAY;
  }

  function set(uint256 entity, Colliders calldata value) public {
    set(entity, abi.encode(value.xs, value.ys));
  }

  function getValue(uint256 entity) public view returns (Colliders memory) {
    (int32[] memory xs, int32[] memory ys) = abi.decode(getRawValue(entity), (int32[], int32[]));
    return Colliders(xs, ys);
  }

  function getEntitiesWithValue(Colliders calldata inputs) public view returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(inputs));
  }
}
