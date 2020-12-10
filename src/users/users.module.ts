import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesModule } from 'src/cities/cities.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { ProductsModule } from 'src/products/products.module';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => IngredientsModule),
    forwardRef(() => ProductsModule),
    TypeOrmModule.forFeature([User]),
    CitiesModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
