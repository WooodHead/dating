import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DbService } from '../src/modules/database/db.service';
import { Connection } from 'mongoose';
import { lastValueFrom, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthE2e } from './auth/auth.e2e';
import { IE2eTest } from './IE2e.test';
import { ProfileE2e } from './profile/profile.e2e';
import { ReportE2e } from './report/report.e2e';
import { AlbumE2e } from './album/album.e2e';
import { useContainer } from 'class-validator';
import { ChatE2e } from './chat/chat.e2e';
import { SocketFactory } from './socket.factory';

export type DataSet = {
    app: INestApplication,
    connection: Connection,
    moduleRef: TestingModule,
    httpServer: any;
    socket?: SocketFactory
}

describe('App', () => {

    let data$: ReplaySubject<DataSet> = new ReplaySubject<DataSet>(1);
    const port = 3001

    const modules: IE2eTest[] = [
        new AuthE2e(data$),
        new ProfileE2e(data$),
        new ReportE2e(data$),
        new AlbumE2e(data$),
        new ChatE2e(data$)
    ]

    beforeAll(async  () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).overridePipe(null).useClass(new ValidationPipe({
            transform: true,
            whitelist: true,
            stopAtFirstError: false
        })).compile();

        const app = moduleRef.createNestApplication();

        useContainer(app.select(AppModule), {fallbackOnErrors: true});

        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            whitelist: true,
            stopAtFirstError: false
        }));

        await app.init();

        await app.listen(port);

        data$.next({
            app,
            socket: new SocketFactory(`http://localhost:${port}`),
            connection: moduleRef.get<DbService>(DbService).getDbHandle(),
            moduleRef,
            httpServer: app.getHttpServer()
        });
    })

    afterAll(async () => {
        const data = await lastValueFrom(data$.pipe(first()));
        await data.connection.dropDatabase();
        await data.app.close();
    });

    modules.forEach(
        module => {
            module.initFactories();
            module.run();
        }
    )
})
