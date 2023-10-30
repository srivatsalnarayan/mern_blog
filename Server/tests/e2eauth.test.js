require("dotenv").config();
const request = require("supertest");
const { connectMongo, disconnectMongo } = require("../dbconnection");
const app = require("../app");
const req = request(app);


describe(('TESTS FOR BLOG API AUTHENTICATION'), () => {
    /**
     * BEFORE ALL
     */
    beforeAll(async () => {
        try {
            await connectMongo(String(process.env.MONGO_URI_STRING));
            console.log("DB Connectin for test is successful");
        } catch (err) {
            console.log(err);
        }
    }, 25000);

    /**
     * AFTER ALL
     */
    afterAll(async () => {
        console.log("Test cases completed. Disconnecting from MongoDB");
        await disconnectMongo();
    }, 50000);

    /**
     * TEST CASE 1 -- SIGNING UP WITH NO DATA
     */
    describe("POST / ", () => {
        test("SHOULD NOT CREATE A NEW USER DUE TO HAVING NO DATA ENTERED", async () => {
            const res = await req.post("/api/v2/users/signup").send({
                email: "",
                password: ""
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 2 -- SIGNING UP WITH NON VALIDATED EMAIL
     */
    describe("POST / ", () => {
        test("SHOULD NOT CREATE A NEW USER DUE TO HAVING UNVALIDATED EMAIL ENTERED", async () => {
            const res = await req.post("/api/v2/users/signup").send({
                email: "testemail",
                password: "abcABC123!"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 3 -- SIGNING UP WITH NOT STRONG PASSWORD
     */
    describe("POST / ", () => {
        test("SHOULD NOT CREATE A NEW USER DUE TO HAVING WEAK PASSWORD ENTERED", async () => {
            const res = await req.post("/api/v2/users/signup").send({
                email: "yoshi@dev.com",
                password: "abc"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 4 -- SIGNING UP SUCCESSFULLY
     */
    describe("POST / ", () => {
        test("SHOULD CREATE A NEW USER SUCCESSFULLY", async () => {
            const res = await req.post("/api/v2/users/signup").send({
                email: "yoshi@dev.com",
                password: "abcABC123!"
            });
            expect(res.status).toBe(201);
            expect(res.headers["content-type"]).toEqual(
                expect.stringContaining("json")
            );
        });
    });
    /**
     * TEST CASE 5 -- SIGNING UP WITH ALREADY IN-USE EMAIL
     */
    describe("POST / ", () => {
        test("SHOULD NOT CREATE A NEW USER WITH EXISTING ACCOUNT", async () => {
            const res = await req.post("/api/v2/users/signup").send({
                email: "yoshi@dev.com",
                password: "abcABC123!"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 6 -- LOGIN USER WITH INCORRECT PASSWORD
     */
    describe("POST / ", () => {
        test("SHOULD NOT LOGIN WITH INCORRECT PASSWORD", async () => {
            const res = await req.post("/api/v2/users/login").send({
                email: "yoshi@dev.com",
                password: "abcABC123"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 7-- LOGIN USER WITH NON EXISTING USER
     */
    describe("POST / ", () => {
        test("SHOULD NOT LOGIN TO A NON EXISTING USER", async () => {
            const res = await req.post("/api/v2/users/login").send({
                email: "AAA@dev.com",
                password: "abcABC123!"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 8-- LOGIN USER WITH NON EXISTING USER
     */
    describe("POST / ", () => {
        test("SHOULD NOT LOGIN TO A NON EXISTING USER", async () => {
            const res = await req.post("/api/v2/users/login").send({
                email: "AAA@dev.com",
                password: "abcABC123!"
            });
            expect(res.status).toBe(400);
        });
    });
    /**
     * TEST CASE 9-- LOGIN USER WITH EMPTY DATAS
     */
    describe("POST / ", () => {
        test("SHOULD LOGIN", async () => {
            const res = await req.post("/api/v2/users/login").send({
                email: "",
                password: ""
            });
            expect(res.status).toBe(400);
        });
    });

    /**
     * TEST CASE 10 -- DELETE A USER 
     */
    describe("DELETE / ", () => {
        test("SHOULD DELETE ACCOUNT", async () => {
            const res = await req.delete("/api/v2/users/deleteAccount?email=yoshi@dev.com").send({
            });
            expect(res.status).toBe(200);
        });
    });
    /**
     * TEST CASE 11 -- DELETE A NON EXISTING USER
     */
    describe("DELETE / ", () => {
        test("SHOULD NOT DELETE A NONEXISTING ACCOUNT", async () => {
            const res = await req.delete("/api/v2/users/deleteAccount?email=yoshi@dev.com").send({
            });
            expect(res.status).toBe(400);
        });
    });
})