import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { PhotosService } from 'src/photos/photos.service';
import { User } from 'src/users/entities/user.entity';
import { Any, Repository } from 'typeorm';
import { CreateProductArgs } from './dto/createProduct.args';
import { GetProductsArgs } from './dto/getProducts.args';
import { Product } from './entities/product.entity';
import slugify from 'slugify';
import * as shortid from 'shortid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private photosService: PhotosService,
    private categoriesService: CategoriesService,
  ) {}

  async createProduct(args: CreateProductArgs, user: User): Promise<Product> {
    if (!args.pickup && !args.shipping && !args.delivery) {
      throw new BadRequestException(
        'At least one delivery method is required.',
      );
    }

    const category = await this.categoriesService.findCategoryById(
      args.category,
    );

    const slug = slugify(args.name, {
      lower: true,
    });

    const result = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values({
        ...args,
        category: category,
        user: user,
        city: user.city,
        slug: `${slug}-${shortid.generate()}`,
        photos: [],
      })
      .execute();

    const product = {
      ...args,
      user: user,
      city: user.city,
      slug: `${slug}-${shortid.generate()}`,
      ...result.raw[0],
    };

    if (args.photos) {
      const savedPhotos = await this.photosService.updatePhotoProduct(
        args.photos,
        user,
        product,
      );

      return { ...product, photos: savedPhotos };
    } else {
      return product;
    }
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
      relations: ['user', 'productIngredients', 'city', 'photos', 'category'],
    });
  }

  findProductsByUser(user: User): Promise<Product[]> {
    return this.productRepository.find({
      where: { user: user },
      relations: ['user', 'productIngredients', 'city', 'photos', 'category'],
    });
  }

  findProductById(id: number) {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['user', 'productIngredients', 'city', 'photos', 'category'],
    });
  }

  findProductsById(id: number[]) {
    return this.productRepository.findByIds(id, {
      relations: ['user', 'productIngredients', 'city', 'photos', 'category'],
    });
  }

  async deleteProductsById(id: number[]) {
    const product = await this.productRepository.findByIds(id, {
      relations: ['photos'],
    });
    return this.productRepository.remove(product);
  }

  updateProduct(product: Product) {
    return this.productRepository.save(product);
  }
}
