import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CategoriesService } from "src/categories/categories.service"
import { PlayersService } from "src/players/players.service"
import { CreateChallengeDto } from "./dtos/create-challenge.dto"
import { Challenge } from "./interfaces/challenge.interface"
import { Model } from "mongoose"
import { ChallengeStatus } from "./interfaces/challenge-status.enum"
import { UpdateChallengeDto } from "./dtos/update-challenge.dto"
import { AddChallengeToMatchDto } from "./dtos/add-challenge-to-match.dto"
import { Match } from "./interfaces/match.interface"

@Injectable()
export class ChallengesService {
    constructor(
        @InjectModel("Challenge")
        private readonly challengeModel: Model<Challenge>,
        @InjectModel("Match") private readonly matchModel: Model<Match>,
        private readonly categoriesService: CategoriesService,
        private readonly playersService: PlayersService
    ) {}

    async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
        if (createChallengeDto.players[0] == createChallengeDto.players[1]) {
            throw new BadRequestException(
                "Inform players different from each other."
            )
        }

        const challengerIsAPlayer = createChallengeDto.players.find(
            player => player === createChallengeDto.challenger
        )
        if (!challengerIsAPlayer) {
            throw new BadRequestException(
                "Challenger must be a challenge player."
            )
        }

        const [player1, player2] = await this.playersService.findMany(
            createChallengeDto.players[0],
            createChallengeDto.players[1]
        )
        if (!player1) {
            throw new NotFoundException(
                `The player ${player1.name} not exists.`
            )
        }
        if (!player2) {
            throw new NotFoundException(
                `The player ${player2.name} not exists.`
            )
        }

        const categoryOfPlayer =
            await this.categoriesService.findCategoryOfPlayer(
                createChallengeDto.challenger
            )
        if (!categoryOfPlayer) {
            throw new BadRequestException(
                "The challenger must be registered in a category."
            )
        }

        const challenge = new this.challengeModel(createChallengeDto)
        challenge.category = categoryOfPlayer.name
        challenge.dateTimeRequest = new Date()
        challenge.status = ChallengeStatus.PENDING
        return challenge.save()
    }

    async findAll(): Promise<Challenge[]> {
        return this.challengeModel
            .find()
            .populate("challenger")
            .populate("players")
            .populate("match")
    }

    async findById(_id: string): Promise<Challenge> {
        const challenge = await this.challengeModel.findById(_id)
        if (!challenge) {
            throw new NotFoundException(
                `The challenge with ID ${_id} do not exists.`
            )
        }
        return challenge
    }

    async findChallengesOfAPlayer(player_id: any): Promise<Challenge[]> {
        await this.playersService.findById(player_id)
        return this.challengeModel
            .find()
            .where("players")
            .in(player_id)
            .populate("challenger")
            .populate("players")
            .populate("match")
    }

    async update(
        _id: string,
        updateChallengeDto: UpdateChallengeDto
    ): Promise<Challenge> {
        const challenge = await this.findById(_id)

        for (const key in updateChallengeDto) {
            challenge[key] = updateChallengeDto[key]
        }

        if (updateChallengeDto.status) challenge.dateTimeResponse = new Date()
        await challenge.save()
        return challenge
    }

    async addChallengeToMatch(
        challenge_id: string,
        addChallengeToMatchDto: AddChallengeToMatchDto
    ): Promise<Challenge> {
        const challenge = await this.findById(challenge_id)

        const winnerIsAPlayer = challenge.players.find(
            player => player._id.toString() === addChallengeToMatchDto.winner
        )
        if (!winnerIsAPlayer) {
            throw new BadRequestException(
                "The winner is not part of the challenge."
            )
        }

        const match = new this.matchModel(addChallengeToMatchDto)
        match.category = challenge.category
        match.players = challenge.players

        await match.save()
        challenge.status = ChallengeStatus.ACCOMPLISHED
        challenge.match = match
        return challenge.save()
    }

    async remove(_id: string): Promise<Challenge> {
        const challenge = await this.findById(_id)
        await this.challengeModel.deleteOne({ _id })
        return challenge
    }
}
