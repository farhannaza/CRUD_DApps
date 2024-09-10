// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CrudApp {
    struct Item {
        uint id;
        string name;
    }

    Item[] public items;
    uint public nextId;
    address public admin;

    // Constructor to set the admin
    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Create a new item
    function create(string memory name) public {
        items.push(Item(nextId, name));
        nextId++;
    }

    // Read an item by id
    function read(uint id) public view returns (uint, string memory) {
        uint i = find(id);
        return (items[i].id, items[i].name);
    }

    // Update an item by id
    function update(uint id, string memory name) public {
        uint i = find(id);
        items[i].name = name;
    }

    // Delete an item by id
    function deleteItem(uint id) public {
        uint i = find(id);
        items[i] = items[items.length - 1];
        items.pop();
    }

    // Find an item by id
    function find(uint id) internal view returns (uint) {
        for (uint i = 0; i < items.length; i++) {
            if (items[i].id == id) {
                return i;
            }
        }
        revert('Item does not exist');
    }

    // Function to transfer Ether to a specified address
    function transferEther(address payable recipient, uint amount) public onlyAdmin {
        require(address(this).balance >= amount, "Insufficient balance in contract");
        recipient.transfer(amount);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
