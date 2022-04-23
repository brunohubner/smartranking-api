import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator"
import { Event } from "../interfaces/event.interface"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(1)
    events: Event[]
}
