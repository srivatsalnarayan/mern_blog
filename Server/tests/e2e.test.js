require("dotenv").config();
const request = require("supertest");
const { connectMongo, disconnectMongo } = require("../dbconnection");
const app = require("../app");
const req = request(app);

let test_id;
let test_title;
let non_format_id = "aaa";
let non_existent_id = "62ef789cb62a803d2253123zz";
let token = "";

describe("TESTS FOR BLOG API ENDPOINTS", () => {
  /**
   * BEFORE ALL
   */
  beforeAll(async () => {
    try {
      await connectMongo(String(process.env.MONGO_URI_STRING));
      const res = await req.post("/api/v2/users/signup").send({
        email: "testuser@email.com",
        password: "test123abcABC!"
      });
      token = res._body.token;
      console.log("Creating a temporary user and loggin in");
      console.log("DB Connectin for test is successful");
    } catch (err) {
      console.log(err);
    }
  }, 25000);

  /**
   * AFTER ALL
   */
  afterAll(async () => {
    await req.delete("/api/v2/users/deleteAccount?email=testuser@email.com").send({
    });
    console.log("Deleting the temporary user");
    console.log("Test cases completed. Disconnecting from MongoDB");
    await disconnectMongo();
  }, 30000);

  /**
   * TEST CASE 1 -- GETTING ALL THE BLOGS UNAUTHORIZED
   */
  describe("GET /", () => {
    test("SHOULD NOT RETURN ALL THE BLOGS DUE TO BEING UNAUTHORIZED", async () => {
      const res = await req.get("/api/v1/blogs");
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(res.status).toBe(401);
    });
  });
  /**
   * TEST CASE 2 -- GETTING ALL THE BLOGS
   */
  describe("GET /", () => {
    test("SHOULD RETURN ALL THE BLOGS", async () => {
      const res = await req.get("/api/v1/blogs")
        .set('Authorization', 'Bearer ' + token)
        ;
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      expect(res.status).toBe(200);
    });
  });


  /**
   * TEST CASE 3 -- POSTING A BLOG WITHOUT AUTHORIZATION
   */
  describe("POST / ", () => {
    test("SHOULD NOT POST THE BLOG DUE TO BEING UNAUTHORIZED", async () => {
      const res = await req.post("/api/v1/blogs/").send({
        title: "TEST",
        author: "TEST",
        profilePicAddress: "./test.png",
        body: "Test",
      });
      test_id = res.body._id;
      test_title = res.body.title;
      expect(res.status).toBe(401);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });


  /**
   * TEST CASE 4 -- POSTING A BLOG
   */
  describe("POST / ", () => {
    test("SHOULD RETURN THE NEWLY ADDED BLOG", async () => {
      const res = await req.post("/api/v1/blogs/").set('Authorization', 'Bearer ' + token).send({
        title: "TEST",
        author: "TEST",
        profilePicAddress: "./test.png",
        body: "Test",
      });
      test_id = res.body._id;
      test_title = res.body.title;
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  /**
   * TEST CASE 5 -- GETTING A BLOG VIA ID
   */
  describe("GET /id", () => {
    test("SHOULD RETURN A BLOG VIA ID", async () => {
      const res = await req.get(`/api/v1/blogs/${test_id}`).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(test_id);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  /**
   * TEST CASE 5 -- GETTING A BLOG VIA NON EXISTENT ID
   */
  describe("GET /id", () => {
    test("SHOULD RETURN A 404 FOR NON-EXISTENT ID", async () => {
      const res = await req.get(`/api/v1/blogs/${non_existent_id}`).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(404);
    });
  });

  /**
   * TEST CASE 6 -- GETTING A BLOG VIA ID WHILE BEING UNAUTHORIZED
   */
  describe("GET /id", () => {
    test("SHOULD RETURN A 401 FOR BEING UNAUTHORIZED", async () => {
      const res = await req.get(`/api/v1/blogs/${non_existent_id}`);
      expect(res.status).toBe(401);
    });
  });

  /**
   * TEST CASE 7 --> UPDATING A USER WHILE BEING UNAUTHORIZED
   */
  describe("PUT /id", () => {
    test("SHOULD RETURN 401 FOR BEING UNAUTHORIZED", async () => {
      const res = await req.put(`/api/v1/blogs/${test_id}`).send({
        title: "EDITED TITLE",
        author: "EDITED AUTHOR",
        profilePicAddress: "./editedTest.png",
        body: "EDITED BODY",
      });
      expect(res.status).toBe(401);
    });
  });
  /**
   * TEST CASE 8 -- ADJUSTING A BLOG
   */
  describe("PUT /id", () => {
    test("SHOULD ADJUST A BLOG VIA ID", async () => {
      const res = await req.put(`/api/v1/blogs/${test_id}`).set('Authorization', 'Bearer ' + token).send({
        title: "EDITED TITLE",
        author: "EDITED AUTHOR",
        profilePicAddress: "./editedTest.png",
        body: "EDITED BODY",
      });
      expect(res.status).toBe(200);
      console.log("PUT / command ", res.body);
      expect(res.body._id).toBe(test_id);
      expect(res.body.title).toBe(test_title);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  /**
   * TEST CASE 9 -- TRYING TO ADJUST A NON EXISTING BLOG
   */
  describe("PUT /id", () => {
    test("SHOULD TRY TO ADJUST A  NON EXISTIN BLOG VIA ID", async () => {
      const res = await req.put(`/api/v1/blogs/${non_existent_id}`).set('Authorization', 'Bearer ' + token).send({
        title: "EDITED TITLE",
        author: "EDITED AUTHOR",
        profilePicAddress: "PROFILE PIC ADDRESS",
        body: "EDITED BODY",
      });
      expect(res.status).toBe(404);
    });
  });

  /**
   * TEST CASE 10 -- TRYING TO ADJUST A BLOG VIA NON FORMAT ID
   */
  describe("PUT /id", () => {
    test("SHOULD TRY TO ADJUST A  NON EXISTIN BLOG VIA ID", async () => {
      const res = await req.put(`/api/v1/blogs/${non_format_id}`).set('Authorization', 'Bearer ' + token).send({
        title: "EDITED TITLE",
        author: "EDITED AUTHOR",
        profilePicAddress: "EDITED PROFILE PIC ADDRESS",
        body: "EDITED BODY",
      });
      expect(res.status).toBe(404);
    });
  });

  /**
   * TEST CASE 11 -- NOT DELETING AN ID DUE TO BEING UNAUTHORIZED
   */
  describe("DELETE /id", () => {
    test("SHOULD RETURN 401 FOR BEING UNAUTHORIZED", async () => {
      const res = await req.delete(`/api/v1/blogs/${test_id}`);
      expect(res.status).toBe(401);
    });
  });

  /**
   * TEST CASE 12 -- DELETE A BLOG VIA ID
   */
  describe("DELETE /id", () => {
    test("SHOULD DELETE A BLOG VIA ID", async () => {
      const res = await req.delete(`/api/v1/blogs/${test_id}`).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
  /**
   * TEST CASE 13 -- DELETE A NON EXISTING BLOG
   */
  describe("DELETE /id", () => {
    test("SHOULD TRY TO DELETE A NON EXISTING BLOG VIA ID", async () => {
      const res = await req.delete(`/api/v1/blogs/${non_existent_id}`).set('Authorization', 'Bearer ' + token);
      expect(res.status).toBe(404);
    });
  });
});
