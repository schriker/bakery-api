import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as depthLimit from 'graphql-depth-limit';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { CaslModule } from './casl/casl.module';
import { ProductsModule } from './products/products.module';
import { ProductIngredientsModule } from './product-ingredients/product-ingredients.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      validationRules: [depthLimit(3)],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UsersModule,
    AuthModule,
    IngredientsModule,
    CaslModule,
    ProductsModule,
    ProductIngredientsModule,
    CitiesModule,
  ],
})
export class AppModule {}
