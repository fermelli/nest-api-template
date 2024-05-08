import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { FindOneUuidParams } from 'src/common/dtos/find-one-uuid-params.dto';

export class UserResetPasswordDto extends FindOneUuidParams {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
