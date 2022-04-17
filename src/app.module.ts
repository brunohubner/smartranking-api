import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { env } from "./config/env"
import { PlayersModule } from "./players/players.module"

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        PlayersModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
