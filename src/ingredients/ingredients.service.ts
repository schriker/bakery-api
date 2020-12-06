import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateIngredientArgs } from './dto/createIngredient.args';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async createIngredient(
    args: CreateIngredientArgs,
    user: User,
  ): Promise<Ingredient> {
    const result = await this.ingredientRepository
      .createQueryBuilder()
      .insert()
      .into(Ingredient)
      .values({
        ...args,
        user: user,
      })
      .execute();
    return {
      ...args,
      user: user,
      ...result.raw[0],
    };
  }

  async findIngredients(user: User): Promise<Ingredient[]> {
    return this.ingredientRepository.find({
      user: user,
    });
  }
}
