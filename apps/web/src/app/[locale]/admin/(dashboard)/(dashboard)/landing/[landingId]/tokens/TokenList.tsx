import LandingTokenItem from "@/components/landing/token/LandingTokenItem";
import EmptyElement from "@/components/feedback/EmptyElement";
import ErrorHandlerElement from "@/components/feedback/error/ErrorHandlerElement";
import { landingTokenKeys } from "@/lib/tanstack/keys";
import { Box, Grid } from "@mui/material";
import { LandingTokenDto } from "@myorg/shared/dto";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    landingId: string;
    data?: LandingTokenDto[];
    error: unknown;
}

export function TokenList({ landingId, data, error }: Props) {
    const queryClient = useQueryClient();

    if (error && (!data || data.length === 0))
        return (
            <ErrorHandlerElement
                reset={() => queryClient.invalidateQueries({ queryKey: landingTokenKeys.all(landingId) })}
                error={error}
            />
        );

    if (data && data.length === 0)
        return (
            <Box display="flex" flexDirection="column" flex={1} py={10}>
                <EmptyElement />
            </Box>
        );

    return (
        <Box display="flex" flexDirection="column" flex={1}>
            <Grid container spacing={1.5} columns={{ xs: 1, md: 2, lg: 3 }}>
                {data?.map((token) => (
                    <Grid size={1} key={token.id}>
                        <LandingTokenItem token={token} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
