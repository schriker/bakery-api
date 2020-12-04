import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsResolver } from './ingredients.resolver';
import { IngredientsService } from './ingredients.service';

@Module({
  exports: [IngredientsService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Ingredient]),
  ],
  providers: [IngredientsResolver, IngredientsService],
})
export class IngredientsModule {}
