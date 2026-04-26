import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { LandingDto, LandingTokenDto, PagedResult } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { LandingService } from "@/modules/landing/landing.service";
import { LandingTokenService } from "@/modules/landing/landingToken.service";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import {
    LandingSchemaWithoutImages,
    LandingWithoutImagesOutput,
    LandingTokenNoteSchema,
    UpdateNoteLandingTokenDtoOutput,
} from "@myorg/shared/form";
import {
    LandingFiles,
    LandingImagesValidationPipe,
    LandingUpdateFiles,
} from "@/infrastructure/file/img/pipes/landingImages.pipe";
import { Public } from "@/modules/auth/decorators/public.decorator";

const { path } = FULL_PATH_ENDPOINT.landing;

const fileFields = FileFieldsInterceptor(
    [
        { name: "icon", maxCount: 1 },
        { name: "logo", maxCount: 1 },
        { name: "background", maxCount: 1 },
    ],
    { storage: memoryStorage() },
);

const { note: tokenNote } = ENDPOINT.landing.token;

@Controller(path)
export class LandingController {
    constructor(
        private landing: LandingService,
        private landingToken: LandingTokenService,
    ) {}

    @Post()
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async create(
        @Body(new ZodValidationPipe(LandingSchemaWithoutImages))
        body: LandingWithoutImagesOutput,
        @UploadedFiles(new LandingImagesValidationPipe({ required: true }))
        files: LandingFiles,
    ): Promise<LandingDto> {
        return this.landing.create(body, files);
    }

    @Put(":id")
    @Auth("ADMIN")
    @UseInterceptors(fileFields)
    async update(
        @Body(new ZodValidationPipe(LandingSchemaWithoutImages))
        data: LandingWithoutImagesOutput,
        @UploadedFiles(new LandingImagesValidationPipe({ required: false }))
        files: LandingUpdateFiles,
        @Param("id") id: string,
    ): Promise<LandingDto> {
        return this.landing.update({ id, data, files });
    }

    @Get()
    @Auth("ADMIN")
    async getAll(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order") order: string = "desc",
        @Query("query") query: string = "",
    ): Promise<PagedResult<LandingDto>> {
        return this.landing.getAll(page, limit, order, query);
    }


    @Get(":id")
    @Public()
    async get(@Param("id") id: string): Promise<LandingDto> {
        return this.landing.get(id);
    }

    @Get(":id/token/:token")
    @Public()
    async getByToken(
        @Param("id") id: string,
        @Param("token") token: string,
    ): Promise<LandingDto> {
        return this.landing.getByToken(id, token);
    }

    @Delete()
    @Auth("ADMIN")
    async deleteAll(): Promise<void> {
        return this.landing.deleteAll();
    }

    @Delete(":id")
    @Auth("ADMIN")
    async delete(@Param("id") id: string): Promise<void> {
        return this.landing.delete(id);
    }

    // --- Token endpoints ---

    @Get(":landingId/token")
    @Auth("ADMIN")
    async getTokens(
        @Param("landingId") landingId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(6), ParseIntPipe) limit: number,
        @Query("order", new DefaultValuePipe("desc")) order: string,
        @Query("query", new DefaultValuePipe("")) query: string,
    ): Promise<PagedResult<LandingTokenDto>> {
        return this.landingToken.getAll(landingId, page, limit, order, query);
    }

    @Post(":landingId/token")
    @Auth("ADMIN")
    async createToken(
        @Param("landingId") landingId: string,
        @Body(new ZodValidationPipe(LandingTokenNoteSchema))
        body: UpdateNoteLandingTokenDtoOutput,
    ): Promise<LandingTokenDto> {
        return this.landingToken.create(landingId, body);
    }

    @Delete(":landingId/token/:tokenId")
    @Auth("ADMIN")
    async deleteToken(
        @Param("landingId") landingId: string,
        @Param("tokenId") tokenId: string,
    ): Promise<void> {
        return this.landingToken.delete(landingId, tokenId);
    }

    @Patch(`:landingId/token/:tokenId/${tokenNote.path}`)
    @Auth("ADMIN")
    async updateTokenNote(
        @Param("landingId") landingId: string,
        @Param("tokenId") tokenId: string,
        @Body(new ZodValidationPipe(LandingTokenNoteSchema))
        body: UpdateNoteLandingTokenDtoOutput,
    ): Promise<LandingTokenDto> {
        return this.landingToken.updateNote(landingId, tokenId, body);
    }
}
