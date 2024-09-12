import { type ClassValue, clsx } from "clsx";
import isEmpty from "lodash/isEmpty";
import negate from "lodash/negate";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isNotEmpty<T>(value: T | null | undefined): value is T {
	return negate(isEmpty)(value);
}
