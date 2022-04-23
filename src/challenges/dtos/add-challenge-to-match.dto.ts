import { IsNotEmpty } from "class-validator"
import { Player } from "src/players/interfaces/player.interface"
import { Result } from "../interfaces/result.interface"
import { ApiProperty } from "@nestjs/swagger"

export class AddChallengeToMatchDto {
    @ApiProperty()
    @IsNotEmpty()
    winner: string

    @ApiProperty()
    @IsNotEmpty()
    result: Result[]
}
