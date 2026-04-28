import { ImageDto } from "./ImageDto";

export type LandingDto = {
    id: string;
    meta: {
        title: string;
        icon: ImageDto;
    };
    logo: ImageDto;
    logoHeight: number;
    color: string;
    phone: string;
    btnName: string;
    title: string;
    background: ImageDto;
    subtitle: string;
    tokenCount: number;
    createdAt: string;
    updatedAt: string;
};
