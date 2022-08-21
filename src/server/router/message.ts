import { createRouter } from './context';
import { z } from 'zod';

export const messageRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany();
    },
  })
  .mutation('create', {
    input: z.object({
      text: z.string().min(5),
      fromCountry: z.string().min(1),
      toCountry: z.string().min(1),
    }),
    async resolve(req) {
      return await req.ctx.prisma.message.create({
        data: {
          toCountry: req.input.toCountry,
          fromCountry: req.input.fromCountry,
          text: req.input.text
        }
      });
    }
  })
