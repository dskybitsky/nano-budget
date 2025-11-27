import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NODEJS {
    /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
    interface Global {}
  }
}
interface CUSTOMNODEJSGLOBAL extends NODEJS.Global {
  prisma: PrismaClient;
}

declare const global: CUSTOMNODEJSGLOBAL;

const isDevelopment = process.env.NODE_ENV === 'development';

const prisma =
  global.prisma ||
  new PrismaClient({
    log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

export default prisma;
