import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const shortenUrlDto = z.object({
  longUrl: z.string().url({ message: 'Please enter a valid URL' }),
  customAlias: z.string().optional(),
  topic: z.string({ message: 'Please enter a valid URL' }),
});

export class ShortenUrlDto extends createZodDto(shortenUrlDto) {}
