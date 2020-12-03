import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserArgs } from './dto/createUser.args';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(args: CreateUserArgs): Promise<number> {
    const isEmailTaken = await this.usersRepository.findOne({
      email: args.email,
    });

    if (isEmailTaken) {
      throw new BadRequestException('User exists.');
    }

    const hash = await bcrypt.hash(args.password, 10);

    const result = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email: args.email,
        password: hash,
      })
      .execute();

    return result.raw[0].id;
  }
}
