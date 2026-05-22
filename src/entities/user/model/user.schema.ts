import { z } from 'zod';

/* ------------------------------------------------------------------ */
/*  Domain                                                            */
/* ------------------------------------------------------------------ */

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

/* ------------------------------------------------------------------ */
/*  Login                                                             */
/* ------------------------------------------------------------------ */

export const LoginInputSchema = z.object({
  email: z.string().trim().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const LoginResponseSchema = z.object({
  user: UserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/* ------------------------------------------------------------------ */
/*  Register — step 1: start                                          */
/* ------------------------------------------------------------------ */

export const RegisterStartInputSchema = z
  .object({
    name: z.string().trim().min(2, 'Имя должно содержать не менее 2 символов'),
    email: z.string().trim().email('Введите корректный email'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать не менее 8 символов')
      .regex(/[A-Za-zА-Яа-я]/, 'Пароль должен содержать буквы')
      .regex(/\d/, 'Пароль должен содержать хотя бы одну цифру'),
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Пароли не совпадают',
  });

/** Form-level input (with password confirmation). */
export type RegisterStartFormValues = z.infer<typeof RegisterStartInputSchema>;

/** What we actually send to the backend (no confirmation field). */
export const RegisterStartPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterStartPayload = z.infer<typeof RegisterStartPayloadSchema>;

export const RegisterStartResponseSchema = z.object({
  challengeId: z.string().min(1),
  /** Echo of the masked email so the verify screen can show "code sent to a**@b.com". */
  email: z.string().email(),
  /** Seconds until the code expires. UI may use this to start a countdown. */
  expiresInSec: z.number().int().positive(),
});

export type RegisterStartResponse = z.infer<typeof RegisterStartResponseSchema>;

/* ------------------------------------------------------------------ */
/*  Register — step 2: verify                                         */
/* ------------------------------------------------------------------ */

export const RegisterVerifyInputSchema = z.object({
  challengeId: z.string().min(1),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Код состоит из 6 цифр'),
});

export type RegisterVerifyInput = z.infer<typeof RegisterVerifyInputSchema>;

export const RegisterVerifyResponseSchema = z.object({
  user: UserSchema,
});

export type RegisterVerifyResponse = z.infer<typeof RegisterVerifyResponseSchema>;
