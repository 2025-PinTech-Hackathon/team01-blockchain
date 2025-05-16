const hre = require("hardhat");

async function main() {
  const gasPrice = await hre.ethers.provider.getGasPrice();

  console.log("EIP712Example 컨트랙트 배포 시작...");

  console.log('컨트랙트 팩토리 생성...');
  const Pintech = await hre.ethers.getContractFactory("Pintech");
  console.log('배포 트랜잭션 생성...');
  const contract = await Pintech.deploy({
    gasPrice: gasPrice.mul(2), // 네트워크 상황에 따라 2~3배로 올려도 됨
    gasLimit: 4000000
  });
  await contract.deployed();
  console.log('배포 완료!');
  console.log("컨트랙트 주소:", contract.address);
}

// 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 