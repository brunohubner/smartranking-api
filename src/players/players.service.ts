import {
    BadRequestException,
    Injectable,
    NotFoundException
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { CreatePlayerDto } from "./dtos/create-player.dto"
import { UpdatePlayerDto } from "./dtos/update-player.dto"
import { Player } from "./interfaces/player.interface"
import { Model } from "mongoose"
import * as mongoose from "mongoose"

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel("Player") private readonly playerModel: Model<Player>
    ) {}

    async create({
        email,
        name,
        phoneNumber
    }: CreatePlayerDto): Promise<Player> {
        const playerExists = await this.playerModel.findOne({
            $or: [{ email }, { phoneNumber }]
        })
        if (playerExists) {
            throw new BadRequestException(
                `There is already a player using this email or phone number.`
            )
        }

        const player = new this.playerModel({
            email,
            name,
            phoneNumber
        })
        await player.save()
        return player
    }

    async findAll(): Promise<Player[]> {
        return this.playerModel.find()
    }

    async findById(_id: string): Promise<Player> {
        const player = await this.playerModel.findById(_id)
        if (!player) {
            throw new NotFoundException(
                `The player with ID ${_id} do not exists.`
            )
        }
        return player
    }

    async findByEmail(email: string): Promise<Player> {
        const player = await this.playerModel.findOne({ email })
        if (!player) {
            throw new NotFoundException(
                `The player with email ${email} do not exists.`
            )
        }
        return player
    }

    async findMany(..._ids: string[]): Promise<Player[]> {
        const queries = _ids.map(_id => new mongoose.Types.ObjectId(_id))
        return this.playerModel.find({ _id: { $in: queries } })
    }

    async update(
        _id: string,
        updatePlayerDto: UpdatePlayerDto
    ): Promise<Player> {
        const [player, emailDuplicated, phoneNumberDuplicated] =
            await Promise.all([
                this.findById(_id),
                this.playerModel.findOne({ email: updatePlayerDto?.email }),
                this.playerModel.findOne({
                    phoneNumber: updatePlayerDto?.phoneNumber
                })
            ])

        if (
            updatePlayerDto?.email &&
            _id !== emailDuplicated?._id.toString() &&
            updatePlayerDto.email === emailDuplicated?.email
        ) {
            throw new BadRequestException(
                `There is already a player using the email ${updatePlayerDto.email}.`
            )
        }
        if (
            updatePlayerDto?.phoneNumber &&
            _id !== phoneNumberDuplicated?._id.toString() &&
            updatePlayerDto.phoneNumber === phoneNumberDuplicated?.phoneNumber
        ) {
            throw new BadRequestException(
                `There is already a player using the phone number ${updatePlayerDto.phoneNumber}.`
            )
        }

        for (const key in updatePlayerDto) {
            player[key] = updatePlayerDto[key]
        }

        await player.save()
        return player
    }

    async remove(_id: string): Promise<Player> {
        const player = await this.findById(_id)
        await this.playerModel.deleteOne({ _id })
        return player
    }
}
