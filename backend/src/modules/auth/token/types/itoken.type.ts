import { UsersDocuments } from '../../../users/schemas/users.schema';
import { TokenTypeEnum } from '../enums/tokenTypes.enum';

export type LoginToken = {
    fingerprint: string,
    user: UsersDocuments,
    type: TokenTypeEnum
};

export type TokenType = {
    fingerprint: string,
    email: string,
    type: TokenTypeEnum
}
