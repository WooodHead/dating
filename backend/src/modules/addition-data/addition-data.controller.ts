import { Controller, Get } from '@nestjs/common';
import { AdditionDataService } from './addition-data.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AdditionalData')
@Controller('data')
export class AdditionDataController {

    public constructor(
        private readonly DataService: AdditionDataService,
    ) {}

    @Get('enums')
    public allEnumData() {
        return this.DataService.allEnumData();
    }

    @Get('nationals')
    public nationality() {
        return this.DataService.allNationality();
    }

    @Get('lang')
    public lang() {
        return this.DataService.allLanguages();
    }

    @Get('countries')
    public countries() {
        return this.DataService.allCountries();
    }
}
