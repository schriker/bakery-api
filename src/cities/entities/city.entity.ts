import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('city')
@ObjectType()
export class City {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  district: string;

  @Field()
  @Column()
  voivodeship: string;

  @Field()
  @Column('decimal')
  latitude: number;

  @Field()
  @Column('decimal')
  longitude: number;

  @Column('tsvector', { select: false })
  document_with_weights: any;
}
