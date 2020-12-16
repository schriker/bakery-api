import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserArgs } from './dto/createUser.args';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUserArgs } from './dto/validateUser.args';
import { CreateSellerArgs } from './dto/createSeller.args';
import { CitiesService } from 'src/cities/cities.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private citiesService: CitiesService,
    private configService: ConfigService,
    private mailingService: MailingService,
  ) {}

  findUserById(id: number) {
    return this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: ['city'],
    });
  }

  async createUser(args: CreateUserArgs): Promise<User> {
    const isEmailTaken = await this.usersRepository.findOne({
      email: args.email,
    });

    if (isEmailTaken) {
      throw new BadRequestException('User exists.');
    }

    const hash = await bcrypt.hash(args.password, 10);
    const token = jwt.sign(
      { email: args.email },
      this.configService.get('JWT_SECRET'),
    );

    const result = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email: args.email,
        password: hash,
        firstName: args.firstName,
        isSeller: false,
        verificationToken: token,
      })
      .execute();

    const user = {
      ...args,
      ...result.raw[0],
    };

    this.mailingService.sendVerificationEmail(user, token);

    return user;
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
    const token = jwt.sign(
      { email: args.email },
      this.configService.get('JWT_SECRET'),
    );

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
        verificationToken: token,
      })
      .execute();

    const user = {
      ...args,
      ...result.raw[0],
    };

    this.mailingService.sendVerificationEmail(user, token);

    return user;
  }

  async emailVerification(token: string) {
    try {
      jwt.verify(token, this.configService.get('JWT_SECRET'));
      const user = await this.usersRepository.findOne({
        where: {
          verificationToken: token,
        },
      });
      user.isVerified = true;
      await this.usersRepository.save(user);
      return true;
    } catch (e) {
      return false;
    }
  }

  async validateUser(args: ValidateUserArgs) {
    const user = await this.usersRepository.findOne({
      where: {
        email: args.email,
      },
      relations: ['city'],
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
