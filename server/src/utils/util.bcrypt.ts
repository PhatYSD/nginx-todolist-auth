import bcrypt from "bcryptjs";

export const compare = async (text: string, hash: string): Promise<boolean> => {
    const result: boolean = await bcrypt.compare(text, hash);

    return result;
}

export const hash = async (text: string): Promise<string> => {
    const sult: string = await bcrypt.genSalt(12);
    const hash: string = await bcrypt.hash(text, sult);

    return hash;
}