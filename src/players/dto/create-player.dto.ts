import { IsNotEmpty, IsEmail } from "class-validator"

export class CreatePlayerDto {
    @IsNotEmpty()
    name: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    phoneNumber: string
}
