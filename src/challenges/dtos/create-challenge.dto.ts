import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsNotEmpty
} from "class-validator"
import { Player } from "src/players/interfaces/player.interface"
import { ApiProperty } from "@nestjs/swagger"

export class CreateChallengeDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    dateTimeChallenge: Date

    @ApiProperty()
    @IsNotEmpty()
    challenger: string

    @ApiProperty()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    players: string[]
}
