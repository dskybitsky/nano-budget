import { PrismaClient } from '@prisma/client';

declare global {
    namespace NODEJS {
        interface Global {}
    }
}
interface CUSTOMNODEJSGLOBAL extends NODEJS.Global {
    prisma: PrismaClient;
}

declare const global: CUSTOMNODEJSGLOBAL;

const prisma =
    global.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
