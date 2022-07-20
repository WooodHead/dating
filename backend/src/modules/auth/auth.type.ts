import { UserProfileDocuments } from '../users/user-profile/schemas/userProfile.schema';
import { Purchase, PurchaseDocument } from '../payment/purchase/purchase.schema';


export type LoginResponse = {
    user: {phone: number, email: string, isFirstLogin: boolean},
    profile: UserProfileDocuments & any,
    token: string,
    subscription: PurchaseDocument | Purchase
}

export type RegistrationResponse = {
    user: {phone: number, email: string},
    profile: UserProfileDocuments & any,
}
