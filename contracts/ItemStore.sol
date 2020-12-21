pragma solidity ^0.5.0;

contract ItemStore {
    string public name;

    uint public itemCount = 0;
    uint public userCount = 0;
    mapping(uint => Item) public items;
    mapping(address => uint[]) userItems;
    mapping(string => Account) accounts;

    struct Item {
        uint id;
        address payable owner;
        string name;
        string description;
        string photoUrl;
        uint price;
        bool isAvailable;
    }

    struct Account {
        string username;
        string password;
        string email;
        address payable userAddress;
    }

    event ItemCreated(
        uint id,
        address payable owner,
        string name, 
        string description, 
        string photoUrl, 
        uint price,  
        bool isAvailable
    );

    event ItemSold(
        uint id,
        address payable owner,
        string name,
        string description,
        bool isAvailable
    );

    event UserCreated(
        string username,
        string email
    );
    
    constructor() public {
        name = "THA BEST E-SHOP";
    }

    function createUser(
        string memory _username,
        string memory _password,
        string memory _email
    ) public {
        require(bytes(_username).length > 0);
        require(bytes(_password).length > 0);
        require(bytes(_email).length > 0);

        accounts[_email] = Account(_username, _password, _email, msg.sender);
        userCount++;

        emit UserCreated(_username, _email);
    }

    function verifyUser(
        string memory _email,
        string memory _password
    ) public view returns (bool) {
        string memory password = accounts[_email].password;
        if(keccak256(abi.encodePacked(password)) == keccak256(abi.encodePacked(_password))) {
            return true;
        } else {
            return false;
        }
    }

    function signupUser(
        string memory _email,
        string memory _password
    ) public view returns (string memory username, string memory email, address userAddress) { //, string memory email, address userAddress
        bool doesExist = verifyUser(_email, _password);
        if(doesExist) {
            Account memory user = accounts[_email];
            return (user.username, user.email, user.userAddress); //, user.email, user.userAddress
        } 
    }

    function createItem(
        string memory _name, 
        string memory _description,
        string memory _photoUrl,
        uint _price
    ) public {
        require(bytes(_name).length > 0);
        require(bytes(_description).length > 0);
        require(_price > 0);

        uint userItemCount = getUserItemCount(msg.sender);
        uint[] memory itemIds;
        uint i = 0;

        itemCount++;

        items[itemCount] = Item(itemCount, msg.sender, _name, _description, _photoUrl, _price, true);

        if(userItemCount > 0) {
            itemIds = new uint[](userItemCount + 1);

            for(i = 0; i < userItemCount; i++) {
                uint id = userItems[msg.sender][i];
                itemIds[i] = id;
            }
        } else {
            itemIds = new uint[](1);
        }

        itemIds[i] = itemCount;

        userItems[msg.sender] = itemIds;
        
        emit ItemCreated(itemCount, msg.sender, _name, _description, _photoUrl, _price, true);
    }

    function getUserItemCount(address user) public view returns (uint) {
        return userItems[user].length;
    }

    function getUserItem(address user, uint index) public view returns (uint) {
        return userItems[user][index];
    }

    function sellItem(
        uint _id
    ) public payable {
        Item memory item = items[_id];

        require(item.isAvailable == true);
        require(msg.sender.balance >= item.price);

        address payable ownerAddress = items[_id].owner;
        
        uint ownerItemCount = getUserItemCount(ownerAddress);
        uint senderItemCount = getUserItemCount(msg.sender); 

        uint[] memory ownerItemIds;
        uint[] memory senderItemIds;

        uint i = 0;

        if(ownerItemCount != 1) {
            ownerItemIds = new uint[](ownerItemCount - 1);
            for(i = 0; i < ownerItemCount; i++) {
                if(userItems[ownerAddress][i] != _id){
                    ownerItemIds[i] = userItems[ownerAddress][i];
                }
            }
        } else {
            ownerItemIds = new uint[](0);
        }

        if(senderItemCount > 0) {
            senderItemIds = new uint[](senderItemCount + 1);
            for(i = 0; i < senderItemCount; i++) {
                senderItemIds[i] = userItems[msg.sender][i];
            }
            senderItemIds[i] = _id;
        } else {
            senderItemIds = new uint[](1);
            senderItemIds[0] = _id;
        }

        userItems[ownerAddress] = ownerItemIds;
        userItems[msg.sender] = senderItemIds;

        item.owner = msg.sender;
        item.isAvailable = false;

        items[_id] = item;

        address(ownerAddress).transfer(item.price);

        emit ItemSold(item.id, item.owner, item.name, item.description, item.isAvailable);
    }
}