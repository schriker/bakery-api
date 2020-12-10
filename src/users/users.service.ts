import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserArgs } from './dto/createUser.args';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUserArgs } from './dto/validateUser.args';
import { CreateSellerArgs } from './dto/createSeller.args';
import { CitiesService } from 'src/cities/cities.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private citiesService: CitiesService,
  ) {}

  findUserById(id: number) {
    return this.usersRepository.findOne(id, { relations: ['city'] });
  }

  async createUser(args: CreateUserArgs): Promise<User> {
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
        isSeller: false,
      })
      .execute();

    return {
      ...args,
      ...result.raw[0],
    };
  }

  async createSeller(args: CreateSellerArgs): Promise<User> {
    const city = await this.citiesService.findCityById(args.city);
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
        firstName: args.firstName,
        lastName: args.lastName,
        isSeller: true,
        city: city,
      })
      .execute();

    return {
      ...args,
      ...result.raw[0],
    };
  }

  async validateUser(args: ValidateUserArgs) {
    const user = await this.usersRepository.findOne({
      email: args.email,
    });

    if (!user) {
      throw new BadRequestException("User dosen't exists.");
    }

    const isPasswordCorrect = await bcrypt.compare(
      args.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong password.');
    }

    return user;
  }
}
