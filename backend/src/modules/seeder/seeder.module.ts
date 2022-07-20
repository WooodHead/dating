import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSeeder } from './users.seeder';
import { User, UserSchema } from '../users/schemas/users.schema';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from '../file/file.module';
import { Nationality, NationalitySchema } from '../addition-data/schemas/nationality.schema';
import { Languages, LanguagesSchema } from '../addition-data/schemas/languages.schema';
import { Countries, CountriesSchema } from '../addition-data/schemas/countries.schema';
import { UserProfile, UserProfileSchema } from '../users/user-profile/schemas/userProfile.schema';
import { Location, LocationSchema } from '../addition-data/schemas/location.schema';
import { PhotoModule } from '../photo/photo.module';
import { UsersModule } from '../users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AlbumModule } from '../album/album.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { Credentials, S3 } from 'aws-sdk';
import { CountriesSeeder } from './countries.seeder';
import { LanguagesSeeder } from './languages.seeder';
import { LocationSeeder } from './location.seeder';
import { NationalitySeeder } from './nationality.seeder';
import { PhotosSeeder } from './photos.seeder';
import { ProductSeeder } from './product.seeder';
import { PaymentModule } from '../payment/payment.module';

seeder({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        FileModule,
        UsersModule,
        EventEmitterModule.forRoot(),
        PhotoModule,
        AlbumModule,
        PaymentModule,
        AwsSdkModule.forRoot({
            defaultServiceOptions: {
                region: process.env.AWS_REGION,
                credentials: new Credentials({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                })
            },
            services: [S3],
        }),
        MongooseModule.forRoot(`mongodb://${process.env.DATABASE_HOST}/`, {
            user: process.env.DATABASE_USER,
            pass: process.env.DATABASE_PASSWORD,
            dbName: process.env.DATABASE_NAME
        }),
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: UserProfile.name, schema: UserProfileSchema},
            {name: Nationality.name, schema: NationalitySchema},
            {name: Languages.name, schema: LanguagesSchema},
            {name: Countries.name, schema: CountriesSchema},
            {name: Location.name, schema: LocationSchema},
        ]),
    ],
}).run([
    CountriesSeeder,
    LocationSeeder,
    LanguagesSeeder,
    NationalitySeeder,
    UsersSeeder,
    PhotosSeeder,
    ProductSeeder
]);
