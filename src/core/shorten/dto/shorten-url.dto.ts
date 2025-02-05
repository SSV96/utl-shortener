import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const shortenUrlDto = z.object({
  longUrl: z.string().url(),
  customAlias: z.string().optional(),
  topic: z.string().optional(),
});

export class ShortenUrlDto extends createZodDto(shortenUrlDto) {}
