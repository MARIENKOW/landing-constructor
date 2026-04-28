import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import { LANDING_IMAGE_CONFIG } from "../../constants";
import { LandingBtnName, LandingColor, LandingLogoHeight, LandingMetaTitle, LandingPhone, LandingSubtitle, LandingTitle } from "../../fields";

const LandingBaseSchema = z.object({
    metaTitle: LandingMetaTitle,
    color: LandingColor,
    phone: LandingPhone,
    title: LandingTitle,
    subtitle: LandingSubtitle,
    logoHeight: LandingLogoHeight,
    btnName: LandingBtnName,
});

const LandingImageField = z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine((f) => f !== null, getMessageKey("form.required"))
    .refine(
        (f) => !(f instanceof File) || LANDING_IMAGE_CONFIG.allowedMimeTypes.includes(f.type),
        getMessageKey("form.file.unsupportedType"),
    )
    .refine(
        (f) => !(f instanceof File) || f.size <= LANDING_IMAGE_CONFIG.maxFileSizeBytes,
        getMessageKey("form.file.landingImage.tooLarge"),
    );

export const LandingSchema = LandingBaseSchema.extend({
    icon: LandingImageField,
    logo: LandingImageField,
    background: LandingImageField,
});

export const LandingSchemaWithoutImages = LandingBaseSchema;

export type LandingInput = z.input<typeof LandingSchema>;
export type LandingOutput = z.output<typeof LandingSchema>;

export type LandingWithoutImagesInput = z.input<typeof LandingSchemaWithoutImages>;
export type LandingWithoutImagesOutput = z.output<typeof LandingSchemaWithoutImages>;
