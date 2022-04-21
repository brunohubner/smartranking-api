import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator"
import { Event } from "../interfaces/event.interface"

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @ArrayMinSize(1)
    events: Event[]
}
