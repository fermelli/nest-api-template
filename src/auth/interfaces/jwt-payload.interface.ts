export interface UserJwtPayload {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload extends UserJwtPayload {
  sub: number;
  iss: string;
}
