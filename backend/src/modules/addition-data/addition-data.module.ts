import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Nationality, NationalitySchema} from "./schemas/nationality.schema";
import {Languages, LanguagesSchema} from "./schemas/languages.schema";
import {Countries, CountriesSchema} from "./schemas/countries.schema";
import {AdditionDataController} from "./addition-data.controller";
import {AdditionDataService} from "./addition-data.service";
import {Location, LocationSchema} from "./schemas/location.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Nationality.name, schema: NationalitySchema },
            { name: Languages.name, schema: LanguagesSchema },
            { name: Countries.name, schema: CountriesSchema },
            { name: Location.name, schema: LocationSchema },
        ]),
    ],
    controllers: [AdditionDataController],
    providers: [AdditionDataService],
    exports: [AdditionDataService]
})
export class AdditionDataModule {

}
