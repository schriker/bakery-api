import { Args, Query, Resolver } from '@nestjs/graphql';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

@Resolver(() => City)
export class CitiesResolver {
  constructor(private citiesService: CitiesService) {}

  @Query(() => [City])
  searchCity(@Args('query') query: string) {
    return this.citiesService.searchCities(query);
  }
}
