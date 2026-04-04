import { atom } from "jotai";
import { WidgetScreen } from "../types";

export const screenAtom = atom<WidgetScreen>("error");

export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);
export const organizationAtom = atom<string | null>(null);
