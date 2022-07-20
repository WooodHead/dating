import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Seeder} from "nestjs-seeder";
import * as fs from "fs";
import {FileService} from "../file/file.service";
import * as path from 'path';
import {Countries} from "../addition-data/schemas/countries.schema";
import {concatMap, from, lastValueFrom, map, of, switchMap} from "rxjs";
import {catchError} from "rxjs/operators";
import { Place, ICountry, Location } from '../addition-data/schemas/location.schema';

@Injectable()
export class LocationSeeder implements Seeder {

    constructor(
        @InjectModel(Location.name) private readonly model: Model<Location>,
        @InjectModel(Countries.name) private readonly countries: Model<Countries>,
    ) {
    }

    async seed(): Promise<any> {
        const rawData = fs.readFileSync(path.resolve(FileService.storagePath, 'seed-data', 'cities.json'));
        const cities = JSON.parse(String(rawData));

        return lastValueFrom(from(cities).pipe(
            concatMap((city: {country: string, name: string, lat: string, lng: string}) => from(this.countries.findOne({iso_code: city.country})).pipe(
                map(country => new this.model({
                    country: {name: country.name, iso_code: country.iso_code, pathToFlag: country.filepath} as ICountry,
                    cityName: city.name,
                    location: { type: 'Point', coordinates: [Number(city.lng), Number(city.lat)] } as Place,
                })),
                switchMap(model => from(model.save())),
                catchError((e) => of(0))
            ))
        ));
    }

    async drop(): Promise<any> {
        return this.model.deleteMany({});
    }
}
