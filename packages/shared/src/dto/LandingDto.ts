import { ImageDto } from "./ImageDto";

export type LandingDto = {
    meta: {
        title: string;
        icon: ImageDto;
    };
    logo: ImageDto;
    color: string;
    phone: string;
    title: string;
    background: ImageDto;
    subtitle: string;
};
