import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field()
  @Column({ default: false })
  isSeller: boolean;

  @Field(() => [Ingredient], { nullable: true })
  @OneToMany(() => Ingredient, (ingredeint) => ingredeint.user, {
    nullable: true,
  })
  ingredients: Ingredient[];
}
