import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/types/casl.types';
import { CategoriesService } from 'src/categories/categories.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateProductArgs } from './dto/createProduct.args';
import { GetProductsArgs } from './dto/getProducts.args';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private caslService: CaslService,
  ) {}

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Product)
  async createProduct(
    @Args() args: CreateProductArgs,
    @CurrentUser() user: User,
  ) {
    this.caslService.checkAbilityForProduct(Action.Manage, user, Product);
    return this.productsService.createProduct(args, user);
  }

  @Query(() => [Product])
  products(@Args() args: GetProductsArgs) {
    return this.productsService.getProducts(args, true);
  }

  @Query(() => [Product])
  @UseGuards(GQLSessionGuard)
  getUserProducts(@CurrentUser() user: User, @Args() args: GetProductsArgs) {
    args.filter = {
      ...args.filter,
      user: user.id,
    };
    return this.productsService.getProducts(args, false);
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args() args: CreateProductArgs,
    @CurrentUser() user: User,
  ) {
    const product = await this.productsService.findProductById(id);
    const category = await this.categoriesService.findCategoryById(
      args.category,
    );
    this.caslService.checkAbilityForProduct(Action.Manage, user, product);

    return this.productsService.updateProduct({
      ...product,
      ...args,
      category: category,
      photos: product.photos,
    });
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id', { type: () => [Int] }) id: number[],
    @CurrentUser() user: User,
  ) {
    const products = await this.productsService.findProductsById(id);

    this.caslService.checkAbilityForProduct(Action.Manage, user, products);

    await this.productsService.deleteProductsById(id);

    return true;
  }
}
