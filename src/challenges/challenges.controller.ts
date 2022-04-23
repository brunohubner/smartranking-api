import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import { ChallengesService } from "./challenges.service"
import { AddChallengeToMatchDto } from "./dtos/add-challenge-to-match.dto"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { Challenge } from "./interfaces/challenge.interface"
import { ChallengeStatusValidationPipe } from "./pipes/challenge-status-validation.pipe"

@Controller("api/v1/challenges")
export class ChallengesController {
    constructor(private readonly challengesService: ChallengesService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(
        @Body() createChallengeDto: CreateChallengeDto
    ): Promise<Challenge> {
        return this.challengesService.create(createChallengeDto)
    }

    @Post(":challenge_id/match")
    @UsePipes(ValidationPipe)
    async addChallengeToMatch(
        @Param("challenge_id") challenge_id: string,
        @Body() addChallengeToMatchDto: AddChallengeToMatchDto
    ): Promise<Challenge> {
        return this.challengesService.addChallengeToMatch(
            challenge_id,
            addChallengeToMatchDto
        )
    }

    @Get()
    async find(@Query("player_id") player_id: string): Promise<Challenge[]> {
        return player_id
            ? this.challengesService.findChallengesOfAPlayer(player_id)
            : this.challengesService.findAll()
    }

    @Patch(":_id")
    @UsePipes(ValidationPipe)
    async update(
        @Param("_id") _id: string,
        @Body(ChallengeStatusValidationPipe)
        updateChallengeDto: UpdateChallengeDto
    ): Promise<Challenge> {
        return this.challengesService.update(_id, updateChallengeDto)
    }

    @Delete(":_id")
    async remove(@Param("_id") _id: string): Promise<Challenge> {
        return this.challengesService.remove(_id)
    }
}
