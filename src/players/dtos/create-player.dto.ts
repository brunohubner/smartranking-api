import { IsNotEmpty, IsEmail, IsString, IsPhoneNumber } from "class-validator"

export class CreatePlayerDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber: string
}
