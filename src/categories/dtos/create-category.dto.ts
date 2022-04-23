import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator"
import { Event } from "../interfaces/event.interface"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    events: Event[]
}
