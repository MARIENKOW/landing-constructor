import { useQuery } from "@tanstack/react-query";
import { landingTokenKeys } from "@/lib/tanstack/keys";
import { LandingTokenParams, defaultLandingTokenParams } from "@/lib/tanstack/listDefaults";
import LandingTokenService from "@/services/landing/landingToken.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";

export { defaultLandingTokenParams };

const { getAll } = new LandingTokenService($apiAdminClient);

export function useLandingTokens(landingId: string, params: LandingTokenParams) {
    return useQuery({
        queryKey: landingTokenKeys.list(landingId, params),
        queryFn: () => getAll(landingId, params).then((r) => r.data),
        placeholderData: (prev) => prev,
    });
}
