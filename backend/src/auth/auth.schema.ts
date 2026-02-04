import z from 'zod';

export const createUserSchema = z.object({
  fullName: z.string({ error: 'Full name is required' }),
  email: z.email({ error: 'Invalid email format' }),
  password: z
    .string({ error: 'Password is required' })
    .regex(/[A-Z]/, {
      error: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      error: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' })
    .regex(/[\W_]/, {
      error: 'Password must contain at least one special character',
    })
    .min(6, { error: 'Password must be at least 6 characters long' })
    .max(15, { error: 'Password must be at most 15 characters long' }),
});
export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const loginUserSchema = createUserSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string({ error: 'Password is required' }),
  });
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
