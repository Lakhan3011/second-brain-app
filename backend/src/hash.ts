
import { nanoid } from "nanoid";

export function generateShortHash(length: number): string {
    return nanoid(length);
}