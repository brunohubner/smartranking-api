import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { env } from "./config/env"
import { PlayersModule } from "./players/players.module"
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({ uri: env.DATABASE_URL })
        }),
        PlayersModule,
        CategoriesModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
