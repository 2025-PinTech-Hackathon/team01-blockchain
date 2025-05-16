const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    // 환경 변수
    const {
        LOCAL_RPC_URL,
        EIPCHAIN_LOCAL,
        HARDHAT1_PRIVATE,
        HARDHAT2_WALLET,
    } = process.env;

    if (!LOCAL_RPC_URL) throw new Error('LOCAL_RPC_URL이 설정되지 않았습니다.');
    if (!EIPCHAIN_LOCAL) throw new Error('EIPCHAIN_LOCAL이 설정되지 않았습니다.');
    if (!HARDHAT1_PRIVATE) throw new Error('HARDHAT1_PRIVATE가 설정되지 않았습니다.');
    if (!HARDHAT2_WALLET) throw new Error('HARDHAT2_WALLET이 설정되지 않았습니다.');


    // 프로바이더 및 지갑
    const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);
    const deployer = new ethers.Wallet(HARDHAT1_PRIVATE, provider);

    // 테스트용 user 지갑 생성
    const user = HARDHAT2_WALLET;
    // console.log('User:', user.address);

    // 컨트랙트 인스턴스
    const EIP712Example = require('../artifacts/contracts/EIP712Example.sol/EIP712Example.json');
    const contract = new ethers.Contract(EIPCHAIN_LOCAL, EIP712Example.abi, deployer);

    // 테스트용 uuid 및 tokenId
    const uuid = 'test-uuid-12345';

    // 1. NFT 발행
    console.log('\nNFT 발행...');
    const mintTx = await contract.mintWithAgentInfo(
        user,
        uuid
    );
    console.log('트랜잭션 해시:', mintTx.hash);

    await mintTx.wait();
    console.log('NFT 발행 완료!');

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