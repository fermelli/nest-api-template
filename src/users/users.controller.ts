import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationAndWithDeletedDto } from 'src/common/dtos/pagination-and-with-deleted.dto';
import { FindOneParams } from 'src/common/dtos/find-one-params.dto';
import { WithDeletedDto } from 'src/common/dtos/with-deleted.dto';
import { FindByEmail } from './dto/find-by-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: PaginationAndWithDeletedDto) {
    return this.usersService.findAll(query);
  }

  @Get('by-email')
  findOneByEmail(@Body() { email }: FindByEmail) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.usersService.findOne(id, query);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams, @Query() query: WithDeletedDto) {
    return this.usersService.remove(id, query);
  }

  @Delete(':id/soft')
  softRemove(@Param() { id }: FindOneParams) {
    return this.usersService.softRemove(id);
  }

  @Patch(':id/restore')
  restore(@Param() { id }: FindOneParams) {
    return this.usersService.restore(id);
  }
}