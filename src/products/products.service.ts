import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductArgs } from './dto/createProduct.args';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(args: CreateProductArgs, user: User): Promise<Product> {
    const result = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
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

  getProducts(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['user', 'productIngredients'],
    });
  }

  findProductsByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({
      where: { user: user },
      relations: ['user', 'productIngredients'],
    });
  }

  findProductById(id: number) {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['user', 'productIngredients'],
    });
  }

  findProductsById(id: number[]) {
    return this.productRepository.findByIds(id, {
      relations: ['user', 'productIngredients'],
    });
  }

  deleteProductsById(id: number[]) {
    return this.productRepository.delete(id);
  }

  updateProduct(product: Product) {
    return this.productRepository.save(product);
  }
}
