import z from "zod";
import { widgetSettingsSchema } from "./constants";

export type FormSchema = z.infer<typeof widgetSettingsSchema>;
