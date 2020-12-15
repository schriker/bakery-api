import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { PhotosModule } from './photos/photos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bull';

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
      uploads: {
        maxFileSize: 5000000, // 5 MB
      },
      validationRules: [depthLimit(3)],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/graphql'],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: parseInt(configService.get('REDIS_PORT')) || 6379,
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    IngredientsModule,
    CaslModule,
    ProductsModule,
    ProductIngredientsModule,
    CitiesModule,
    PhotosModule,
  ],
})
export class AppModule {}
