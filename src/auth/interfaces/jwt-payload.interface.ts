export interface BasicJwtPayload {
  sub: number;
  iss: string;
  iat?: number;
  exp?: number;
}

export interface UserJwtPayload {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccesTokenJwtPayload extends BasicJwtPayload, UserJwtPayload {}

export type RefreshTokenJwtPayload = BasicJwtPayload;
