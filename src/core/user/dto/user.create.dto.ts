import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const userCreateDto = z.object({
  email: z.string().email(),
  name: z.string(),
});

export class UserCreateDto extends createZodDto(userCreateDto) {}
