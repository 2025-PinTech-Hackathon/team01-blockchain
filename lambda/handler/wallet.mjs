import { ethers } from 'ethers';

export default async (event) => {
  try {
    // 랜덤 지갑 생성
    const wallet = ethers.Wallet.createRandom();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        wallet_address: wallet.address,
        private_key: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase
      })
    };
  } catch (error) {
    console.error('지갑 생성 중 오류:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
