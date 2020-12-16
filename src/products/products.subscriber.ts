import { PhotosService } from 'src/photos/photos.service';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  RemoveEvent,
  Connection,
} from 'typeorm';
import { Product } from './entities/product.entity';

@EventSubscriber()
export class ProductsSubscriber implements EntitySubscriberInterface {
  constructor(
    private connection: Connection,
    private photosService: PhotosService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Product;
  }

  beforeRemove(event: RemoveEvent<Product>) {
    this.photosService.removePhotoFiles(event.entity.photos);
  }
}
