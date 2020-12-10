import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private cityRepository: Repository<City>,
  ) {}

  async searchCities(query: string) {
    const result = await this.cityRepository.query(
      `SELECT * FROM (
      SELECT *
      FROM city, to_tsquery($1) AS q
      WHERE (document_with_weights @@ q)
    ) AS t1 ORDER BY ts_rank(t1.document_with_weights, to_tsquery($1)) DESC LIMIT 10;`,
      [`${query.trim().split(' ').join(' | ')}:*`],
    );

    return result;
  }

  findCityById(id: number) {
    return this.cityRepository.findOne(id);
  }
}
