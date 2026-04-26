import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { LandingService } from "@/modules/landing/landing.service";
import { LandingTokenService } from "@/modules/landing/landingToken.service";
import { LandingController } from "@/modules/landing/landing.controller";
import { ImageModule } from "@/infrastructure/file/img/image.module";
import { RequestContextModule } from "@/common/request-context/request-context.module";

@Module({
    imports: [PrismaModule, ImageModule, RequestContextModule],
    providers: [LandingService, LandingTokenService],
    controllers: [LandingController],
    exports: [LandingService],
})
export class LandingModule {}
