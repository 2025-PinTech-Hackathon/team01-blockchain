import { ethers } from 'ethers';

// 컨트랙트 ABI와 주소
import Pintech from '../contracts/Pintech.sol/Pintech.json' with { type: 'json' };
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export default async (event) => {
  try {
    const { userAddress, uuid, agentName } = JSON.parse(event.body);

    if (!userAddress || !uuid || !agentName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false,
          error: '필수 파라미터가 누락되었습니다.' 
        })
      };
    }

    // 프로바이더 설정
    const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology');
    const deployer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Pintech.abi, deployer);

    console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("DEPLOYER_PRIVATE_KEY defined:", !!process.env.DEPLOYER_PRIVATE_KEY);

    // NFT 발행
    const tx = await contract.mintWithAgentInfo(
      userAddress,
      uuid,
      agentName
    );

    await tx.wait(1);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionHash: tx.hash,
        message: 'NFT 발행 완료'
      })
    };
  } catch (error) {
    console.error('NFT 발행 중 오류:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
