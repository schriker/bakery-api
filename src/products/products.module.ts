import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { PhotosModule } from 'src/photos/photos.module';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsSubscriber } from './products.subscriber';

@Module({
  exports: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product]), CaslModule, PhotosModule],
  providers: [ProductsResolver, ProductsService, ProductsSubscriber],
})
export class ProductsModule {}
