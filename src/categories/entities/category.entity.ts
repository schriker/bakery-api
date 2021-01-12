import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/entities/product.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('category')
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  icon: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.category, {
    nullable: true,
  })
  products: Product[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
