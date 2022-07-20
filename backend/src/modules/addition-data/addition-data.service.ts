import { Injectable } from '@nestjs/common';
import {
    AlcoholEnum,
    BodyTypeEnum,
    DietTypeEnum,
    EthnicEnum,
    EyesEnum,
    GenderEnum,
    HairEnum,
    HairTypeEnum,
    ProfessionalEnum,
    SmokeEnum,
    StatusEnum,
    UserPreferenceEnum
} from '../users/user-profile/enums/userProfile.enum';
import { Nationality, NationalityDocuments } from './schemas/nationality.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Languages, LanguagesDocuments } from './schemas/languages.schema';
import { Countries, CountriesDocuments } from './schemas/countries.schema';
import { from, map, Observable } from 'rxjs';
import { Location, LocationDocuments } from './schemas/location.schema';
import { MongooseHelpersService } from '../helpers/mongoose-helpers.service';

@Injectable()
export class AdditionDataService {

    public constructor(
        @InjectModel(Nationality.name) private readonly nationalityModel: Model<NationalityDocuments>,
        @InjectModel(Languages.name) private readonly langModel: Model<LanguagesDocuments>,
        @InjectModel(Countries.name) private readonly countriesModel: Model<CountriesDocuments>,
        @InjectModel(Location.name) private readonly locationModel: Model<LocationDocuments>,
    ) {}

    public allEnumData() {
        return {
            gender: GenderEnum,
            status: StatusEnum,
            hair: HairEnum,
            hairType: HairTypeEnum,
            eyes: EyesEnum,
            preference: UserPreferenceEnum,
            bodyType: BodyTypeEnum,
            professional: ProfessionalEnum,
            diet: DietTypeEnum,
            smoke: SmokeEnum,
            ethnic: EthnicEnum,
            alcohol: AlcoholEnum
        };
    }

    allNationality(): Observable<NationalityDocuments[]> {
        return from(this.nationalityModel.find().exec());
    }

    allLanguages(): Observable<LanguagesDocuments[]> {
        return from(this.langModel.find().exec());
    }

    allCountries(): Observable<CountriesDocuments[]> {
        return from(this.countriesModel.find().exec());
    }

    public searchCityName(name: string, take = 5, skip = 0): Observable<LocationDocuments[]> {
        return from(this.locationModel.find({cityName: new RegExp(`^${name}`, 'i')}).skip(Number(skip)).limit(Number(take)).exec());
    }

    public getLocationByParam(filter: FilterQuery<LocationDocuments>, projection = undefined): Observable<LocationDocuments> {
        return MongooseHelpersService.findOneOrError(this.locationModel, filter, projection)
    }

    public getRandomLocation(count: number): Observable<LocationDocuments> {
        return from(this.locationModel.aggregate([{$sample: {size: count}}]).exec()).pipe(
            map(arr => arr[0])
        )
    }
}
