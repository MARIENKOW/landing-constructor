"use client";

import { landingTokenKeys } from "@/lib/tanstack/keys";
import LandingTokenService from "@/services/landing/landingToken.service";
import { $apiAdminClient } from "@/utils/api/admin/fetch.admin.client";
import { errorHandler } from "@/helpers/error/error.handler.helper";
import { snackbarSuccess } from "@/utils/snackbar/snackbar.success";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { LandingTokenDto, PagedResult } from "@myorg/shared/dto";

const service = new LandingTokenService($apiAdminClient);

type TokenList = PagedResult<LandingTokenDto> | undefined;

export function useLandingTokenListCache(landingId: string) {
    const queryClient = useQueryClient();

    function cancel() {
        return queryClient.cancelQueries({ queryKey: landingTokenKeys.lists(landingId) });
    }

    function sync() {
        queryClient.invalidateQueries({ queryKey: landingTokenKeys.lists(landingId) });
    }

    function update(updater: (t: LandingTokenDto) => LandingTokenDto, id: string) {
        queryClient.setQueriesData<TokenList>(
            { queryKey: landingTokenKeys.lists(landingId) },
            (old) => {
                if (!old) return old;
                return { ...old, data: old.data.map((t) => (t.id === id ? updater(t) : t)) };
            },
        );
    }

    function remove(id: string) {
        queryClient.setQueriesData<TokenList>(
            { queryKey: landingTokenKeys.lists(landingId) },
            (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.filter((t) => t.id !== id),
                    meta: { ...old.meta, total: old.meta.total - 1 },
                };
            },
        );
    }

    return { cancel, sync, update, remove };
}

export function useCreateLandingToken(landingId: string) {
    const t = useTranslations();
    const { cancel, sync } = useLandingTokenListCache(landingId);

    return useMutation({
        mutationFn: (body: Parameters<typeof service.create>[1]) =>
            service.create(landingId, body).then((r) => r.data),
        onMutate: () => cancel(),
        onSuccess: () => {
            snackbarSuccess(t("pages.admin.landing.token.feedback.created"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}

export function useDeleteLandingToken(landingId: string) {
    const t = useTranslations();
    const { cancel, remove, sync } = useLandingTokenListCache(landingId);

    return useMutation({
        mutationFn: (tokenId: string) => service.delete(landingId, tokenId),
        onMutate: () => cancel(),
        onSuccess: (_, tokenId) => {
            remove(tokenId);
            snackbarSuccess(t("pages.admin.landing.token.feedback.deleted"));
        },
        onError: (error) => errorHandler({ error, t }),
        onSettled: () => sync(),
    });
}
