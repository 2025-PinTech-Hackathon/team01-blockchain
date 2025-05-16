# ERC721 기반 대행인 NFT 발급

## EIP721 -> ERC721로 표준 변경

- 원칙적으로 프론트엔드에서 서명하는 로직을 진행해야 됩니다.

- 금융 소외 계층은 지갑 생성에도 어려움을 겪을 확률이 높습니다.

- 이를 해결하기 위해 사용자별 지갑을 생성하고 서비스 제공자의 중앙 지갑에서 각 사용자의 프록시 지갑으로 NFT를 발급합니다.
- EIP 기반은 대행인 지갑 + 디지털 소외계층 사용자 지갑을 생성하게 되어 대행인 -> 사용자 지갑 서명의 과정을 거치게 됩니다.
- 지금 형성된 로직에서 바로 사용할 수 있게 ERC721 기반으로 간소화 했습니다.

## 검증 로직

### 사용자별 wallet을 생성하고, 대행인 등록 과정에서 대행인의 이름과 NFT를 특정할 수 있는 고유 값을 전달하면 이를 메타데이터로 갖는 NFT를 발행합니다.

하나의 uuid같은 고유 값은 하나의 NFT에만 사용될 수 있습니다. 내부 NFT의 Token에도 Id 값이 존재하며 UUID => TokenId 매핑이 되어있고 require를 통한 검증 로직이 존재합니다.

검증 과정에서 이전에 전달했던 고유 값(예를 들어 user_id 기반 uuid값)을 컨트랙트 rpc에 전달해 존재하는지 여부를 반환 받을 수 있습니다.

대행인 메타데이터 값을 반환하는 로직을 추가했습니다. 이를 백엔드에 전달해 NFT가 존재하는지 확인하고 대행인 이름이 동일한지 확인합니다.

hardhat local node에서 테스트를 완료했습니다.

Polygon Amoy Testnet에 컨트랙트 배포 후 트랜잭션 모두 성공적으로 완료 후 람다로 이관까지 완료했습니다.

## 3개의 엔드포인트
엔드포인트는 총 3개 존재합니다.

- 지갑 생성
- 대행인 등록
- 검증

1번의 경우 전달 파라미터가 없이 반환 값만 존재합니다. wallet_address, private_key, phrase가 string으로 반환 될 예정입니다.

2번의 경우 (고유값, 대행인 이름)을 인자로 전달합니다. 반환값은 boolean으로 반환될 예정입니다.

3번의 경우 (고유값)을 인자로 전달합니다. 반환값은 boolean으로 반환될 예정입니다.

## Lambda와 API 게이트웨이를 통한 서버리스 배포

추가적으로 express를 로컬에서 돌리기보다 배포를 간편화하기 위해 AWS Lambda를 통해 서버리스 배포를 진행합니다.


동일한 3개의 엔트포인트를 /dev 스테이지에서 배포합니다.

![image](https://github.com/user-attachments/assets/a4a24865-8333-420a-becc-39f7f2a28b94)
![image](https://github.com/user-attachments/assets/d1c1d350-b0f0-403c-8fa3-995989799431)


Lambda 메인 handler에서는 분기처리를 통해 각 요청에 맞는 동작을 수행합니다.

```
import wallet from './handler/wallet.mjs';
import register from './handler/register.mjs';
import verify from './handler/verify.mjs';


export const handler = async (event) => {
  
  const { httpMethod, path } = event;
  console.log("EVENT:", JSON.stringify(event));

  if (path.startsWith('/register') && httpMethod === 'GET') {
    return await register(event);
  } else if (path.startsWith('/verify') && httpMethod === 'GET') {
    return await verify(event);
  } else if (path.startsWith('/wallet') && httpMethod === 'GET') {
    return await wallet(event);
  } 

  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  };
}
```


### 지갑 생성 GET 요청
![image](https://github.com/user-attachments/assets/1ebf8e23-984b-459e-9cde-23e572e39ab0)


### NFT 발급 POST 요청
```
{
  "userAddress" : "0xFdCEcEc5818E31E3e8f03Ab3FAc5EA7e6e380287",
  "uuid": "test-uuid",
  "agentName": "홍길동"
}
```
![image](https://github.com/user-attachments/assets/da021d23-62a0-49b5-88a8-c65ad11f917c)


### NFT 검증 GET 요청

```
uuid=test-uuid-123456
```
![image](https://github.com/user-attachments/assets/0876638d-e215-485e-ac76-fdf712e39591)


