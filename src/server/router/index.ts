// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { messageRouter } from './message';

export const appRouter = createRouter().transformer(superjson).merge('message.', messageRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
