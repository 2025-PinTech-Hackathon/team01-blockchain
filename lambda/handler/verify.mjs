import { ethers } from 'ethers';

// 컨트랙트 ABI와 주소
import Pintech from '../contracts/Pintech.sol/Pintech.json' with { type: 'json' };
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export default async (event) => {
  try {
    const uuid = event.queryStringParameters?.uuid;
    
    if (!uuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'UUID가 필요합니다.' 
        })
      };
    }

    // 프로바이더 설정
    const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology')
    const deployer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Pintech.abi, deployer);

    // NFT 존재 여부 확인
    const exists = await contract.verifyUser(uuid);
    
    // 대행인 정보 조회
    let agentName = null;
    if (exists) {
      agentName = await contract.getAgentNameByUUID(uuid);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        agentName: agentName,
        message: exists ? 'NFT가 존재합니다.' : 'NFT가 존재하지 않습니다.'
      })
    };
  } catch (error) {
    console.error('NFT 검증 중 오류:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
