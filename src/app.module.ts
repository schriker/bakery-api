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
import { UploadsService } from './uploads/uploads.service';
import { UploadsModule } from './uploads/uploads.module';
import { MailingModule } from './mailing/mailing.module';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { redisClient } from './main';
import { CategoriesModule } from './categories/categories.module';
import * as cookie from 'cookie';

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
      subscriptions: {
        onConnect: async (connectionParams, webSocket, context) => {
          const cookies = cookie.parse(context.request.headers.cookie);
          const [redisKey] = cookies['connect.sid']
            .split('s:')
            .pop()
            .split('.');
          const session = JSON.parse(await redisClient.get(`sess:${redisKey}`));
          return {
            session,
          };
        },
      },
      context: async ({ req, connection }) => {
        if (connection) {
          return { req: connection.context };
        }
        return { req };
      },
      installSubscriptionHandlers: true,
      uploads: false,
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
    UploadsModule,
    MailingModule,
    MessagesModule,
    PubSubModule,
    CategoriesModule,
  ],
  providers: [UploadsService],
})
export class AppModule {}
