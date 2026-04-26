import { LandingTokenDto, PagedResult } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { FetchCustom, FetchCustomReturn } from "@/utils/api";
import { CreateLandingTokenDtoOutput, UpdateNoteLandingTokenDtoOutput } from "@myorg/shared/form";
import { toSearchParams } from "@/utils/toSearchParams";
import { LandingTokenParams } from "@/lib/tanstack/listDefaults";

const basePath = FULL_PATH_ENDPOINT.landing.path;
const { token } = ENDPOINT.landing;
const JSON_HEADERS = { "Content-Type": "application/json" };

export default class LandingTokenService {
    getAll: (landingId: string, params: LandingTokenParams) => FetchCustomReturn<PagedResult<LandingTokenDto>>;
    create: (landingId: string, body: CreateLandingTokenDtoOutput) => FetchCustomReturn<LandingTokenDto>;
    delete: (landingId: string, tokenId: string) => FetchCustomReturn<void>;
    updateNote: (landingId: string, tokenId: string, body: UpdateNoteLandingTokenDtoOutput) => FetchCustomReturn<LandingTokenDto>;

    constructor(api: FetchCustom) {
        this.getAll = (landingId, params) => {
            const query = toSearchParams(params);
            return api<PagedResult<LandingTokenDto>>(
                `${basePath}/${landingId}/${token.path}?${query}`,
                { method: "GET" },
            );
        };

        this.create = (landingId, body) =>
            api<LandingTokenDto>(`${basePath}/${landingId}/${token.path}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: JSON_HEADERS,
            });

        this.delete = (landingId, tokenId) =>
            api<void>(`${basePath}/${landingId}/${token.path}/${tokenId}`, {
                method: "DELETE",
            });

        this.updateNote = (landingId, tokenId, body) =>
            api<LandingTokenDto>(
                `${basePath}/${landingId}/${token.path}/${tokenId}/${token.note.path}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(body),
                    headers: JSON_HEADERS,
                },
            );
    }
}
