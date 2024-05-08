import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneUuidParams {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
