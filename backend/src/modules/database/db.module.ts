import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `mongodb://${process.env.DATABASE_HOST}/`,
                user: process.env.DATABASE_USER,
                pass: process.env.DATABASE_PASSWORD,
                dbName: (process.env.NODE_ENV != 'test') ? process.env.DATABASE_NAME : process.env.TEST_DATABASE_NAME,
                useCreateIndex: true
            }),
        }),
    ],
    providers: [DbService],
    controllers: [],
    exports: [DbService]
})
export class DbModule {}
