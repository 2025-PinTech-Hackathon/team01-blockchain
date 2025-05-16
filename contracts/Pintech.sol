// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pintech is ERC721, Ownable {
    uint256 private _nextTokenId = 1;
    mapping(string => uint256) public uuidToTokenId;
    mapping(uint256 => string) public tokenIdToAgentName;  // 토큰 ID로 대행인 이름 조회

    event NFTMinted(address indexed to, uint256 indexed tokenId, string uuid, string agentName);

    constructor() ERC721("VerifyNFT", "MNFT") {}

    /**
     * @dev agent 정보와 함께 NFT 발행 (owner만 가능)
     * @param to NFT를 받을 사용자 주소
     * @param uuid user 아이디
     * @param agentName 대행인 이름
     */
    function mintWithAgentInfo(
        address to,
        string memory uuid,
        string memory agentName
    ) public onlyOwner {
        require(uuidToTokenId[uuid] == 0, "UUID Used");
        uint256 tokenId = _nextTokenId;
        _mint(to, tokenId);
        uuidToTokenId[uuid] = tokenId;
        tokenIdToAgentName[tokenId] = agentName;  // 대행인 이름 저장
        _nextTokenId++;
        emit NFTMinted(to, tokenId, uuid, agentName);
    }

    /**
     * @dev UUID로 대행인 이름 조회 (가스비 없음)
     * @param uuid user 아이디
     */
    function getAgentNameByUUID(string memory uuid) public view returns (string memory) {
        uint256 tokenId = uuidToTokenId[uuid];
        require(tokenId != 0, "No NFT for this uuid");
        return tokenIdToAgentName[tokenId];
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