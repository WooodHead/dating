import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

export type FilePrefix = 'lg-' | 'md-' | 'sm-' | 'md-b-' | 'album-tl-' | 'album-tl-b-'

@Injectable()
export class FileHelperService {

    public static largeImgPrefix: FilePrefix = 'lg-';
    public static mediumImgPrefix: FilePrefix = 'md-';
    public static mediumBlurImgPrefix: FilePrefix = 'md-b-';
    public static smallImgPrefix: FilePrefix = 'sm-';
    public static titleImgPrefix: FilePrefix = 'album-tl-';
    public static titleBlurImgPrefix: FilePrefix = 'album-tl-b-';

    public static createFileName(format: string): string {
        return uuid.v4() + '.' + format;
    }

    public static bufferToSting(buffer: Buffer): {img: string} {
        return {img: 'data:image/jpeg;base64,' + buffer.toString('base64')};
    }
}
