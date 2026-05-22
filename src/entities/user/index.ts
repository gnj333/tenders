/**
 * Public API of the `user` entity (client-safe).
 *
 * Server-only fetchers live in `@/entities/user/server` so importing them
 * from a client component fails at build time.
 */

export {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRegisterStartMutation,
  useRegisterVerifyMutation,
} from './api/use-user';
export { userKeys } from './api/user.keys';
export {
  type LoginInput,
  LoginInputSchema,
  type LoginResponse,
  LoginResponseSchema,
  type RegisterStartFormValues,
  RegisterStartInputSchema,
  type RegisterStartPayload,
  RegisterStartPayloadSchema,
  type RegisterStartResponse,
  RegisterStartResponseSchema,
  type RegisterVerifyInput,
  RegisterVerifyInputSchema,
  type RegisterVerifyResponse,
  RegisterVerifyResponseSchema,
  type User,
  UserSchema,
} from './model/user.schema';
