import { IsEmail, IsNumber, IsPhoneNumber, IsString } from "class-validator"

export class UpdatePlayerDto {
    @IsString()
    name?: string

    @IsEmail()
    email?: string

    @IsPhoneNumber()
    phoneNumber?: string

    @IsString()
    ranking?: string

    @IsNumber()
    rankingPosition?: number

    @IsString()
    urlAvatarPlayer?: string
}
