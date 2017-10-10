/// <reference path="../node_modules/@types/jest/index.d.ts" />

describe("Sample Unit Test", () => {

    describe("Simple Addition", () => {
        it("should be 10", (done) => {
            expect(6 + 4).toBe(10);
            done();
        });
    });
});