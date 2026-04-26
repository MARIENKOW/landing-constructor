import { InvitationNote } from "../../fields";
import z from "zod";

export const LandingTokenNoteSchema = z.object({
    note: InvitationNote,
});

export type CreateLandingTokenDtoInput = z.input<typeof LandingTokenNoteSchema>;
export type CreateLandingTokenDtoOutput = z.infer<typeof LandingTokenNoteSchema>;
export type UpdateNoteLandingTokenDtoInput = CreateLandingTokenDtoInput;
export type UpdateNoteLandingTokenDtoOutput = CreateLandingTokenDtoOutput;
