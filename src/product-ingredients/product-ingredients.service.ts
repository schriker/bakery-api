import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Injectable()
export class ProductIngredientsService {
  constructor(
    @InjectRepository(ProductIngredient)
    private ingredientRepository: Repository<ProductIngredient>,
  ) {}
}
