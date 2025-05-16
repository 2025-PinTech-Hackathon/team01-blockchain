const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    // 환경 변수
    const {
        AMOY_RPC_URL,
        EIPCHAIN,
        DEPLOYER_PRIVATE_KEY,
        RECEIVER,
    } = process.env;

    if (!AMOY_RPC_URL) throw new Error('AMOY_RPC_URL이 설정되지 않았습니다.');
    if (!EIPCHAIN) throw new Error('EIPCHAIN이 설정되지 않았습니다.');
    if (!DEPLOYER_PRIVATE_KEY) throw new Error('DEPLOYER_PRIVATE_KEY가 설정되지 않았습니다.');
    if (!RECEIVER) throw new Error('RECEIVER가 설정되지 않았습니다.');


    // 프로바이더 및 지갑
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
    const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

    // 테스트용 user 지갑 생성
    const user = RECEIVER;
    // console.log('User:', user.address);

    // 컨트랙트 인스턴스
    const Pintech = require('../artifacts/contracts/Pintech.sol/Pintech.json');
    const contract = new ethers.Contract(EIPCHAIN, Pintech.abi, deployer);

    // 테스트용 uuid 및 tokenId
    const uuid = 'test-uuid-123456';
    const agentName = '홍길동';

    // 1. NFT 발행
    console.log('\nNFT 발행...');
    const gasPrice = await provider.getGasPrice();
    const mintTx = await contract.mintWithAgentInfo(
        user,
        uuid,
        agentName,
        {
            gasPrice: gasPrice.mul(2), // 가스비 2배로 설정
            gasLimit: 5000000, // 가스 한도 설정
        }
    );
    console.log('트랜잭션 해시:', mintTx.hash);

    console.log('트랜잭션 처리 대기 중...');
    try {
        await mintTx.wait(1); // 1개의 블록 확인
        console.log('NFT 발행 완료!');
    } catch (error) {
        console.error('트랜잭션 처리 중 오류:', error);
        throw error;
    }

    // 2. uuid로 NFT 존재 여부 확인
    const exists = await contract.verifyUser(uuid);
    console.log(`uuid(${uuid})로 NFT 존재 여부:`, exists);

    // 3. 잘못된 uuid로 조회
    const notExists = await contract.verifyUser('not-exist-uuid');
    console.log('존재하지 않는 uuid로 NFT 존재 여부:', notExists);

    // 4. NFT 소유자 확인
    const owner = await contract.ownerOfUUID(uuid);
    console.log('NFT 소유자:', owner);
    console.log('예상 소유자:', user);
    console.log('소유권 일치:', owner.toLowerCase() === user.toLowerCase());
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}