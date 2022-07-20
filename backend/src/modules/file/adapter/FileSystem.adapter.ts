import { IFileAdapter } from './IFile.adapter';
import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { FileService } from '../file.service';
import { catchError } from 'rxjs/operators';

export default class FileSystemAdapter implements IFileAdapter {

    public static readonly targetDir = 'static';

    public take(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<Buffer> {
        const originFilepath = path.resolve(targetDirName, filePrefix, fileName);
        return of(fs.readFileSync(originFilepath));
    }

    url(fileName: string, targetDirName: string, filePrefix: string): string {
        return `/${targetDirName}/${filePrefix}/${fileName}`;
    }

    public upload(fileBuffer: Buffer, fileName: string, targetDirName: string, filePrefix: string): Observable<string> {
        try {
            const pathToDir = path.resolve(FileService.uploadsPath, targetDirName, filePrefix);
            if (!fs.existsSync(pathToDir)) fs.mkdirSync(pathToDir, { recursive: true });
            const targetPath = path.resolve(pathToDir, fileName);
            fs.writeFileSync(targetPath, fileBuffer);
            return of(`/${targetDirName}/${filePrefix}/${fileName}`);
        } catch (e) {
            console.log(e);
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    delete(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<boolean> {
        return of(path.resolve(FileService.uploadsPath, targetDirName, filePrefix, fileName)).pipe(
            map(target => {
                fs.unlinkSync(target);
                return true;
            }),
            catchError(e => of(false))
        );
    }

}
