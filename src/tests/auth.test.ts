import { comparePasswords, hashPassword } from "../auth";

describe("Auth Utils:", () => {
    // Correctly hashes password
    it("hashes and compares passwords", async () => {
        const password = "password";
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).not.toEqual(password);

        const isMatch = await comparePasswords(password, hashedPassword);
        expect(isMatch).toBe(true);
    });
});