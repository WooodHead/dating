import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { combineLatest, from, map, mapTo, Observable, of, switchMap } from 'rxjs';
import FileSystemAdapter from './adapter/FileSystem.adapter';
import S3Adapter from './adapter/S3.adapter';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { IFileAdapter } from './adapter/IFile.adapter';
import { FileHelperService, FilePrefix } from '../helpers/file-helper.service';
import { AlbumDocuments } from '../album/schemas/album.schema';
import { catchError } from 'rxjs/operators';
import { readdir } from 'fs/promises';

@Injectable()
export class FileService {

    private readonly fileSystem: FileSystemAdapter = new FileSystemAdapter();
    private readonly s3: S3Adapter;

    public static lgSize: [number, number] = [1024, 768];
    public static mdSize: [number, number] = [270, 360];
    public static smSize: [number, number] = [100, 100];

    public static readonly storagePath = path.resolve(__dirname, '../../../', 'storage');
    public static readonly uploadsPath = path.resolve(__dirname, '../../../', 'uploads');

    public static readonly staticPath = path.resolve(FileService.uploadsPath, 'static');
    public static readonly avatarPath = path.resolve(FileService.staticPath, 'avatar');
    public static readonly pemPath = path.resolve(FileService.storagePath, 'keys');
    public static readonly publicKeyPemPath = FileService.pemPath + '/public.key';
    public static readonly privateKeyPemPath = FileService.pemPath + '/private.key';

    constructor(
        @InjectAwsService(S3) private readonly amazonInstanceS3: S3,
    ) {
        this.s3 = new S3Adapter(amazonInstanceS3);
    }

    public pathToObject(path: string): { source: string, user: string, fileName: string } {
        const data = path.split('/');
        return {source: data[1], user: data[2], fileName: data[3]};
    }

    public getImgUrl(
        path: string,
        filePrefix: FilePrefix
    ): string {
        if(!path) return '';
        const _path = this.pathToObject(path);
        const _adapter = this.choseAdapter(_path.source);
        return _adapter.url(`${filePrefix}${_path.fileName}`, _path.source, _path.user);
    }

    uploadImg(
        fileBuffer: Buffer,
        targetDirName: string,
        user: string,
        fileName: string
    ): Observable<string> {
        const _adapter = this.choseAdapter(targetDirName);
        return combineLatest({
            lg: this.checkAndProcessIMG(fileBuffer, FileService.lgSize, 0).pipe(
                switchMap(_buffer => _adapter.upload(_buffer, `${FileHelperService.largeImgPrefix}${fileName}`, targetDirName, user))
            ),
            md: this.checkAndProcessIMG(fileBuffer, FileService.mdSize, 0).pipe(
                switchMap(_buffer => _adapter.upload(_buffer, `${FileHelperService.mediumImgPrefix}${fileName}`, targetDirName, user))
            ),
            mdBlur: this.checkAndProcessIMG(fileBuffer, FileService.mdSize, 8).pipe(
                switchMap(_buffer => _adapter.upload(_buffer,`${FileHelperService.mediumBlurImgPrefix}${fileName}`, targetDirName, user))
            ),
            sm: this.checkAndProcessIMG(fileBuffer, FileService.smSize, 0).pipe(
                switchMap(_buffer => _adapter.upload(_buffer, `${FileHelperService.smallImgPrefix}${fileName}`, targetDirName, user))
            ),
        }).pipe(mapTo(`/${targetDirName}/${user}/${fileName}`))
    }

    public uploadAlbumTitlePhoto(
        path: string,
        album: AlbumDocuments
    ): Observable<string> {
        if(!path) return of('');
        const _path = this.pathToObject(path);
        return this.takeImgBufferFromRawData(`${FileHelperService.mediumImgPrefix}${_path.fileName}`, _path.source, _path.user).pipe(
            switchMap(buffer => combineLatest({
                title: this.checkAndProcessIMG(buffer, FileService.mdSize, 0).pipe(
                    switchMap(_buffer => this.customUploadImg(_buffer, S3Adapter.photoBucket, String(album.belongTo), `${FileHelperService.titleImgPrefix}${album._id}.jpg`))
                ),
                blur: this.checkAndProcessIMG(buffer, FileService.mdSize, 8).pipe(
                    switchMap(_buffer => this.customUploadImg(_buffer, S3Adapter.photoBucket, String(album.belongTo), `${FileHelperService.titleBlurImgPrefix}${album._id}.jpg`))
                ),
            })),
            mapTo(`/${S3Adapter.photoBucket}/${String(album.belongTo)}/${album._id}.jpg`)
        )
    }

    public deleteImg(path: string): Observable<boolean> {
        if(!path) return of(false);
        const _path = this.pathToObject(path);
        const _adapter = this.choseAdapter(_path.source);
        return combineLatest({
            lg: _adapter.delete(`${FileHelperService.largeImgPrefix}${_path.fileName}`, _path.source, _path.user),
            md: _adapter.delete(`${FileHelperService.mediumImgPrefix}${_path.fileName}`, _path.source, _path.user),
            mdBlur: _adapter.delete(`${FileHelperService.mediumBlurImgPrefix}${_path.fileName}`, _path.source, _path.user),
            sm: _adapter.delete(`${FileHelperService.smallImgPrefix}${_path.fileName}`, _path.source, _path.user),
        }).pipe(
            mapTo(true),
            catchError(e => of(false))
        );
    }

    public deleteAlbumTitlePhoto(path: string): Observable<boolean> {
        if(!path) return of(true);
        const _path = this.pathToObject(path);
        const _adapter = this.choseAdapter(_path.source);
        return combineLatest({
            lg: _adapter.delete(`${FileHelperService.titleImgPrefix}${_path.fileName}`, _path.source, _path.user),
            md: _adapter.delete(`${FileHelperService.titleBlurImgPrefix}${_path.fileName}`, _path.source, _path.user),
        }).pipe(
            mapTo(true),
            catchError(e => of(false))
        );
    }

    public takeImgBufferFromRawData(
        fileName: string,
        targetDirName: string,
        user: string
    ): Observable<Buffer> {
        const _adapter = this.choseAdapter(targetDirName);
        return _adapter.take(fileName, targetDirName, user);
    }

    public readDirectory(targetDirName: string): Observable<string[]> {
        return from(readdir(targetDirName)).pipe(
            map(filenames => filenames.filter(name => name.match(/\.(jpg)$/i))),
            map(filenames => filenames.map(filename => targetDirName + '/' + filename))
        );
    }

    public customUploadImg(
        fileBuffer: Buffer,
        targetDirName: string,
        user: string,
        fileName: string
    ): Observable<string> {
        const _adapter = this.choseAdapter(targetDirName);
        return _adapter.upload(fileBuffer, fileName, targetDirName, user)
    }

    private choseAdapter(targetDirName: string): IFileAdapter {
        return (targetDirName == S3Adapter.photoBucket) ? this.s3 : this.fileSystem;
    }

    public savePemKeys(publicKey: string, privateKey: string) {
        console.log(FileService.pemPath, 'pen');
        if (!fs.existsSync(FileService.pemPath)) fs.mkdirSync(FileService.pemPath, {recursive: true});
        fs.writeFileSync(path.resolve(FileService.privateKeyPemPath), privateKey)
        fs.writeFileSync(path.resolve(FileService.publicKeyPemPath), publicKey)
        return true;
    }

    public checkAndProcessIMG(imgBuffer: Buffer, resize: [number, number], blur: number): Observable<Buffer> {
        const stream = sharp(imgBuffer).rotate().resize({width: resize[0], height: resize[1]}).jpeg({quality: 100});
        if (blur) stream.blur(blur);
        return from(stream.toBuffer()) as Observable<Buffer>;
    }
}
