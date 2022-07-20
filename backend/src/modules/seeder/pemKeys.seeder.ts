import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { FileService } from '../file/file.service';

const {generateKeyPairSync} = crypto;
const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
    }
});

if (!fs.existsSync(FileService.pemPath)) fs.mkdirSync(FileService.pemPath, {recursive: true});
fs.writeFileSync(path.resolve(FileService.privateKeyPemPath), privateKey)
fs.writeFileSync(path.resolve(FileService.publicKeyPemPath), publicKey)
