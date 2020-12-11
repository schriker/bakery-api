import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsResolver } from './ingredients.resolver';
import { IngredientsService } from './ingredients.service';

@Module({
  exports: [IngredientsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Ingredient]), CaslModule],
  providers: [IngredientsResolver, IngredientsService],
})
export class IngredientsModule {}
