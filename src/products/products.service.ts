import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { CreateProductArgs } from './dto/createProduct.args';
import { GetProductsArgs } from './dto/getProducts.args';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(args: CreateProductArgs, user: User): Promise<Product> {
    if (!args.pickup && !args.shipping && !args.delivery) {
      throw new BadRequestException(
        'At least one delivery method is required.',
      );
    }

    const result = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        ...args,
        user: user,
        city: user.city,
      })
      .execute();
    return {
      ...args,
      user: user,
      city: user.city,
      ...result.raw[0],
    };
  }

  getProducts(
    args: GetProductsArgs,
    publishedOnly: boolean,
  ): Promise<Product[]> {
    let where = {
      isPublished: publishedOnly ? true : Any([false, true]),
    };

    if (args.filter) {
      where = {
        ...where,
        ...args.filter,
      };
    }

    return this.productRepository.find({
      where: where,
      order: {
        createdAt: args.order?.createdAt || null,
        price: args.order?.price || null,
        isPublished: args.order?.isPublished || null,
      },
      take: args.limit,
      skip: args.currentPage * args.limit,
      relations: ['user', 'productIngredients', 'city'],
    });
  }

  findProductsByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({
      where: { user: user },
      relations: ['user', 'productIngredients', 'city'],
    });
  }

  findProductById(id: number) {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['user', 'productIngredients', 'city'],
    });
  }

  findProductsById(id: number[]) {
    return this.productRepository.findByIds(id, {
      relations: ['user', 'productIngredients', 'city'],
    });
  }

  deleteProductsById(id: number[]) {
    return this.productRepository.delete(id);
  }

  updateProduct(product: Product) {
    return this.productRepository.save(product);
  }
}
