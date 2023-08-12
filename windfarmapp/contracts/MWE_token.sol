// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.6.6; 
  
import "github.com/provable-things/ethereum-api/provableAPI.sol";

import "./libraries/CBOR.sol";
import "./interfaces/provable-interface.sol";
import "./interfaces/provable-address-resolver-interface.sol";

 interface ERC20Interface { 
   function totalSupply() external view returns (uint256); 
   function balanceOf(address account) external view returns (uint256); 
   function allowance(address owner, address spender) external view returns (uint256); 
   function transfer(address recipient, uint256 amount) external returns (bool); 
   function approve(address spender, uint256 amount) external returns (bool); 
   function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
   
    
	//function deposit(uint256 amount) external payable (uint256);
	//function withdraw(address payable _to, uint _amount) external (uint256);
	 //function getBalance() external view returns(uint);
	// function getAddress() external view returns(address);
  event Transfer(address indexed from, address indexed to, uint256 value); 
  event Approval(address indexed owner, address indexed spender, uint256 value); 

} 
 
contract MWE_token is ERC20Interface { 
 
	string public symbol; 
	string public name; 
	uint8 public decimals; 
	uint public _totalSupply; 
	address public tokenOwner; 
 
	mapping(address => uint) private _balances; 
	mapping(address => mapping(address => uint256)) private _allowances; 
 
	constructor() public { 
	 tokenOwner = msg.sender; 
	 symbol="MWE"; 
	 name="MWE_Token"; 
	 decimals=2; 
	 _totalSupply = 5000000 * 10** uint(decimals); 
	 _balances[tokenOwner] = _totalSupply; 
	 emit Transfer(address(0), tokenOwner, _totalSupply); 
	} 
 
	function totalSupply() public view override returns (uint256) { 
	 return _totalSupply - _balances[address(0)]; 
	} 
	 
	function balanceOf(address account) public view override returns (uint256) { 
	 return _balances[account]; 
	} 
 
	function allowance(address owner, address spender) public view virtual override returns 
	(uint256) { 
	 return _allowances[owner][spender]; 
	} 
 
	function transfer(address recipient, uint256 amount) public virtual override returns (bool) 
	{ 
	 address sender = msg.sender; 
	 
	 _balances[sender] = _balances[sender] - amount; 
	 _balances[recipient] = _balances[recipient] + amount; 
	 emit Transfer(sender, recipient, amount); 
	 return true; 
	} 
 
	function approve(address spender, uint256 amount) public virtual override returns (bool) { 

	address sender = msg.sender; 
	 
	 _allowances[sender][spender] = amount; 
	 emit Approval(sender, spender, amount); 
	 return true; 
	} 
 
	function transferFrom(address sender, address recipient, uint256 amount) public virtual 
override returns (bool) { 
 
	 _balances[sender] = _balances[sender] - amount; 
	 _balances[recipient] = _balances[recipient] + amount; 
	 emit Transfer(sender, recipient, amount); 
	 
	 _allowances[sender][recipient] = amount; 
	 emit Approval(sender, recipient, amount); 
	 return true; 
	} 

	//Address --> Contract -- deposit
    function deposit() external payable {
    }

    //Contract --> Address  -- withdrawal
    function withdraw(address payable _to, uint _amount) external {
        _to.transfer(_amount);
    }

    function getBalance() external view returns(uint) {
        return address(this).balance;
    }

    function getAddress() external view returns(address) {
        return address(this);
    }

} 