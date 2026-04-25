import { Box, Card, CardHeader, MenuProps } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { StyledIconButton } from "@/components/ui/StyledIconButton";
import { StyledMenu } from "@/components/ui/StyledMenu";
import { StyledMenuItem } from "@/components/ui/StyledMenuItem";
import { StyledListItemIcon } from "@/components/ui/StyledListItemIcon";
import { useTranslations } from "next-intl";
import { useConfirm } from "@/hooks/useConfirm";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { Link } from "@/i18n/navigation";
import { useDeleteLanding } from "@/hooks/tanstack/useLandingMutations";
import CardContent from "@mui/material/CardContent";
import { LandingDto } from "@myorg/shared/dto";
import { StyledTypography } from "@/components/ui/StyledTypography";
import { Chip } from "@mui/material";
import HeaderUser from "@/components/layout/header/user/HeaderUser";

const LandingItem = ({ landing }: { landing: LandingDto }) => {
    const t = useTranslations();
    const [anchorEl, setAnchorEl] = useState<MenuProps["anchorEl"] | null>(
        null,
    );
    const { confirm, confirmDialog } = useConfirm();
    const deleteLanding = useDeleteLanding();

    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        deleteLanding.mutate(landing.id);
    };

    const { title, subtitle, background, logo, logoHeight } = landing;

    return (
        <Card
            component="div"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "none",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            {confirmDialog}

            <StyledMenu
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                sx={{ paddingBottom: 0 }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Link
                    href={
                        FULL_PATH_ROUTE.admin.landing.update.path +
                        "/" +
                        landing.id
                    }
                >
                    <StyledMenuItem onClick={() => setAnchorEl(null)}>
                        <StyledListItemIcon>
                            <EditIcon />
                        </StyledListItemIcon>
                        {t("common.update")}
                    </StyledMenuItem>
                </Link>
                <StyledMenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleDelete();
                    }}
                >
                    <StyledListItemIcon>
                        <DeleteForeverIcon color="error" />
                    </StyledListItemIcon>
                    <StyledTypography
                        color="error"
                        textTransform="capitalize"
                        textAlign="center"
                    >
                        {t("common.delete")}
                    </StyledTypography>
                </StyledMenuItem>
            </StyledMenu>
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                    pb: "0 !important",
                    minWidth: 0,
                }}
            >
                <HeaderUser>
                    <Box component={"img"} height={logoHeight} src={logo.url} />
                </HeaderUser>
                <Box
                    sx={{
                        backgroundImage: `url('${background.url}')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    flex={1}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Box
                        textAlign={"center"}
                        display={"flex"}
                        maxWidth={700}
                        flexDirection={"column"}
                        gap={2}
                        margin={"0 auto"}
                        width={"100%"}
                        p={2}
                    >
                        <StyledTypography
                            fontSize={20}
                            color="#fff"
                            variant="h1"
                        >
                            {title}
                        </StyledTypography>
                        <StyledTypography fontSize={12} color="#fff">
                            {subtitle}
                        </StyledTypography>
                    </Box>
                </Box>
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    p={1}
                    justifyContent={"space-between"}
                    flexWrap="wrap"
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box
                            sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                bgcolor: landing.color,
                                border: "1px solid",
                                borderColor: "divider",
                                flexShrink: 0,
                            }}
                        />
                        <StyledTypography
                            variant="caption"
                            color="text.disabled"
                            fontFamily="monospace"
                        >
                            {landing.color}
                        </StyledTypography>
                        <Chip
                            label={landing.phone}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                    <StyledIconButton
                        aria-haspopup="true"
                        onClick={(e: SyntheticEvent) =>
                            setAnchorEl(e.currentTarget)
                        }
                    >
                        <MoreVertIcon fontSize="medium" />
                    </StyledIconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LandingItem;
