import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const shortenUrlDto = z.object({
  longUrl: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .transform((url) => {
      return url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;
    }),
  customAlias: z.string().optional(),
  topic: z.string().optional(),
});

export class ShortenUrlDto extends createZodDto(shortenUrlDto) {}
