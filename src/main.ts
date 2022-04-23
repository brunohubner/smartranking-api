import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./common/filters/http-exeption.filter"
import { env } from "./config/env"
import * as momentTimezone from "moment-timezone"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalFilters(new AllExceptionsFilter())

    Date.prototype.toJSON = function (): any {
        return momentTimezone(this)
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DD HH:mm:ss.SSS")
    }

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Smart Ranking")
        .setDescription("The api for football players challengers.")
        .setVersion("0.0.1")
        .addTag("dev")
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup("docs", app, document)

    await app.listen(env.PORT)
}
bootstrap()
