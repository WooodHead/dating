import { Observable, of, tap } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { DataSet } from './app.e2e-spec';

export interface IE2eTest {
    initFactories(): Observable<any>
    run()
}

export abstract class E2eTest implements IE2eTest{

    protected testsDescription = 'Default';
    protected tests: {name: string, fn: Observable<any>}[] = [];

    constructor(
        protected data$: Observable<DataSet>
    ) {}

    public initFactories(): Observable<any> {
        return of(null);
    }

    public run() {
        describe(this.testsDescription, () => {
            this.tests.forEach(
                test => {
                    it(test.name, done => {
                        test.fn.pipe(
                            tap(() => console.log('log', test.name)),
                            delay(500),
                            first()
                        ).subscribe({
                            complete: () => done(),
                            error: (e) => done(e)
                        });
                    })
                }
            )
        })
    }

}
