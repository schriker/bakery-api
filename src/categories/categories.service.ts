import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  findCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: { id: id },
    });
  }
}
