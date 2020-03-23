import jwt from 'jsonwebtoken';
import ServerContext from '@server/context';

function createToken(userId: string, expiresIn: string) {
  const token = jwt.sign({ userId }, ServerContext.TOKEN_SECRET_KEY, { expiresIn });

  return `Bearer ${token}`;
}

export { createToken };
