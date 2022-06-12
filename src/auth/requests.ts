import { Request } from 'express';
import { AuthIdentity } from './jwt.strategy';

export type PrivateRequest = Request & { user: AuthIdentity };
