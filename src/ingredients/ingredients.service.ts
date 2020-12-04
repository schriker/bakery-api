import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientArgs } from './dto/createIngredient.args';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async createIngredient(args: CreateIngredientArgs): Promise<Ingredient> {
    const result = await this.ingredientRepository
      .createQueryBuilder()
      .insert()
      .into(Ingredient)
      .values(args)
      .execute();
    return {
      ...args,
      ...result.raw[0],
    };
  }

  // Later Find By User ID
  async findIngredients(): Promise<Ingredient[]> {
    return this.ingredientRepository.find();
  }
}
