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