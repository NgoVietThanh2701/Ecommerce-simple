// SPDX-License-Identifier: NONE
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; /*revert when transaction failed */
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Products {
    IERC20 private token;
    uint uid;
    address public admin;

    enum State {
        MadeProduct,
        BuyProduct,
        Comfirm
    }

    struct ProductDetails {
        string name;
        uint256 price;
        string image;
        string description;
    }

    struct Product {
        uint256 uid;
        address owner;
        address consumer;
        ProductDetails productDetails;
        State productState;
    }

    mapping(uint256 => Product) products;

    constructor(address _admin, IERC20 _token) {
        admin = _admin;
        token = _token;
        uid = 1;
    }

    event MadeProduct(uint256 uid);
    event BuyProduct(uint256 uid);
    event Comfirm(uint256 uid);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Sender is not a admin");
        _;
    }

    /// @dev Step 1: Harvesred a product
    function madeProduct(
        string memory _name,
        uint256 _price,
        string memory _images,
        string memory _description
    ) public onlyAdmin {
        Product memory product;
        product.uid = uid;
        product.owner = msg.sender;
        /* set details for product*/
        product.productDetails.name = _name;
        product.productDetails.price = _price;
        product.productDetails.image = _images;
        product.productDetails.description = _description;
        product.productState = State.MadeProduct;
        products[uid] = product;
        emit MadeProduct(uid);
        uid++;
    }

    /// @dev Step 2: Purchase product from Third Party
    function buyProduct(uint256 _uid) public {
        require(
            token.balanceOf(msg.sender) >= products[_uid].productDetails.price,
            "Insufficient account balance"
        );
        SafeERC20.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            products[_uid].productDetails.price
        );
        products[_uid].productState = State.BuyProduct;
        products[_uid].consumer = msg.sender;

        emit BuyProduct(_uid);
    }

    function comfirm(uint256 _uid) public onlyAdmin {
        products[_uid].productState = State.Comfirm;
        SafeERC20.safeTransfer(
            token,
            msg.sender,
            products[_uid].productDetails.price
        );
        products[_uid].owner = products[_uid].consumer;
        emit Comfirm(_uid);
    }

    /// @dev Get all product
    function getProducts() public view returns (Product[] memory) {
        Product[] memory listProduct = new Product[](uid - 1);
        for (uint256 i = 1; i < uid; i++) {
            listProduct[i - 1] = products[i];
        }
        return listProduct;
    }
}
