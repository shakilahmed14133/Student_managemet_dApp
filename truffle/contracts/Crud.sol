// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crud {
    struct Item {
        uint id;
        string name;
        string data;
    }

    mapping(uint => Item) private items;
    uint private itemCount;

    // Event to notify about item creation
    event ItemCreated(uint id, string name, string data);
    event ItemUpdated(uint id, string name, string data);
    event ItemDeleted(uint id);

    // Create a new item
    function createItem(string memory name, string memory data) public {
        items[itemCount] = Item(itemCount, name, data);
        emit ItemCreated(itemCount, name, data); // Emit event for frontend
        itemCount++;
    }

    // Read an item (including ID)
    function readItem(uint id) public view returns (uint, string memory, string memory) {
        Item memory item = items[id];
        require(id < itemCount, "Item does not exist"); // Ensure valid ID
        return (item.id, item.name, item.data);
    }

    // Update an item
    function updateItem(uint id, string memory name, string memory data) public {
        require(id < itemCount, "Item does not exist"); // Ensure valid ID
        items[id] = Item(id, name, data);
        emit ItemUpdated(id, name, data); // Emit event for frontend
    }

    // Delete an item
    function deleteItem(uint id) public {
        require(id < itemCount, "Item does not exist"); // Ensure valid ID
        delete items[id];
        
       // emit ItemDeleted(id); // Emit event for frontend
        
    }

    // Get the total count of items
    function getItemCount() public view returns (uint) {
        return itemCount;
    }

    // Get all items (IDs, names, and data)
    function getAllItems() public view returns (uint[] memory, string[] memory, string[] memory) {
        uint[] memory ids = new uint[](itemCount);
        string[] memory names = new string[](itemCount);
        string[] memory dataList = new string[](itemCount);

        for (uint i = 0; i < itemCount; i++) {
            if (bytes(items[i].name).length > 0) { // Skip deleted items
                ids[i] = items[i].id;
                names[i] = items[i].name;
                dataList[i] = items[i].data;
            }
        }
        return (ids, names, dataList);
    }
}
