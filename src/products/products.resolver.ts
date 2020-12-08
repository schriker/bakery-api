import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslProductAbilityFactory } from 'src/casl/casl-product-ability.factory';
import { Action } from 'src/casl/types/casl.types';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateProductArgs } from './dto/createProduct.args';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private caslProductAbilityFactory: CaslProductAbilityFactory,
    private productsService: ProductsService,
  ) {}

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Product)
  createProduct(@Args() args: CreateProductArgs, @CurrentUser() user: User) {
    const ability = this.caslProductAbilityFactory.createForUser(user);

    if (!ability.can(Action.Manage, Product)) {
      throw new ForbiddenException();
    }

    return this.productsService.createProduct(args, user);
  }

  @Query(() => [Product])
  products() {
    return this.productsService.getProducts();
  }

  // @UseGuards(GQLSessionGuard)
  // @Mutation(() => Product)
  // async updateProduct

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id', { type: () => [Int] }) id: number[],
    @CurrentUser() user: User,
  ) {
    const ability = this.caslProductAbilityFactory.createForUser(user);
    const products = await this.productsService.findProductsById(id);

    products.forEach((product) => {
      if (!ability.can(Action.Manage, product)) {
        throw new ForbiddenException();
      }
    });

    await this.productsService.deleteProductsById(id);

    return true;
  }
}
