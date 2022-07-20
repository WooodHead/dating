import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { AlbumSharePermissionDocuments } from './album-share/album-share-permission.schema';

export type PermissionResponse = {
    profile: UserProfileDocuments,
    permissionToAlbums?: AlbumSharePermissionDocuments[]
}
