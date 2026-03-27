import { LoginPayload, RegisterPayload, AuthSession, PublicUser } from '@/types';

export interface IAuthRepository {
  login(payload: LoginPayload): Promise<AuthSession>;
  register(payload: RegisterPayload): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<PublicUser | null>;
}
