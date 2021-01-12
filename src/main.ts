import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Redis from 'ioredis';
import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { __prod__ } from './contsants';

let redisClient: Redis.Redis;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const RedisStore = connectRedis(session);
    redisClient = new Redis(configService.get('REDIS_PORT') || 6379);
    app.use(
      helmet({
        contentSecurityPolicy: __prod__ ? undefined : false,
      }),
    );
    app.enableCors();
    app.use(
      session({
        secret: configService.get('SESSION_SECRECT'),
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({
          client: redisClient,
          disableTouch: true,
          disableTTL: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: 'lax',
          secure: __prod__,
        },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(4000);
  } catch (e) {
    console.log(e);
  }
}
bootstrap();

export { redisClient };
