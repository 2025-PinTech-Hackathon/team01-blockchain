// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pintech is ERC721, Ownable {
    uint256 private _nextTokenId = 1;
    mapping(string => uint256) public uuidToTokenId;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string uuid);

    constructor() ERC721("VerifyNFT", "MNFT") {}

    /**
     * @dev agent 정보와 함께 NFT 발행 (owner만 가능)
     * @param to NFT를 받을 사용자 주소
     * @param uuid user 아이디
     */
    function mintWithAgentInfo(
        address to,
        string memory uuid
    ) public onlyOwner {
        require(uuidToTokenId[uuid] == 0, "UUID Used");
        uint256 tokenId = _nextTokenId;
        _mint(to, tokenId);
        uuidToTokenId[uuid] = tokenId;
        _nextTokenId++;
        emit NFTMinted(to, tokenId, uuid);
    }

    function verifyUser(
        string memory uuid
     ) external view returns(bool exists){
        return uuidToTokenId[uuid] != 0;
    }

    function ownerOfUUID(string memory uuid) public view returns (address) {
        uint256 tokenId = uuidToTokenId[uuid];
        require(tokenId != 0, "No NFT for this uuid");
        return ownerOf(tokenId);
    }
} 