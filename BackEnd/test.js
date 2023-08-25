const mongoose = require("mongoose");
const request = require("supertest");
const app = require("./app");

const fs = require('fs');

require("dotenv").config();



const arr = 
    {"places": [
            {"__v": 2, "_id": "642df9f45310285218c6ae65", "address": "Blackpool pleasure beach ", "creator": "6429c85356f8de16357760a3", "description": "Me and the kids went to Blackpool to see the beach and go on the Pepsi max rollercoaster", "id": "642df9f45310285218c6ae65", "image": "uploads\\images\\7ae70815-6519-4bc4-8beb-87d82f4ed9e7.jpeg", "likes": [], "location": {"lat": 53.79233, "lng": -3.0552927}, "title": "Went to Blackpool pleasure beach today"}, {"__v": 0, "_id": "642dfa565310285218c6af2f", "address": "The bridge chippy rochdale", "creator": "6429c85356f8de16357760a3", "description": "Can't beat a cold beverage in the sun with fish and chips :)", "id": "642dfa565310285218c6af2f", "image": "uploads\\images\\afe3dc83-aaa8-483f-8a6e-89c27365f726.jpeg", "likes": [], "location": {"lat": 53.6275849, "lng": -2.2153884}, "title": "Fish and Chips"}
        ]
};




//getAllPosts
describe("GET /", () => {
    it("should return JSON array", async () => {
        const res = await request(app).get("/api/places/getAllPosts");

       // expect(res.body).toMatchObject(arr);
        expect(res.statusCode).toBe(200);
    });
});



describe("GET /", () => {
    it("should print out a console log", async () => {
        const res = await request(app).get("/api/places/test");

        expect(res.body.name).toBe("test");
        expect(res.statusCode).toBe(200);
    });
});


//addNewPost
describe("POST /", () => {
    const imageBuffer = fs.readFileSync('./uploads/images/book.png');
    const testImage = `${__dirname}./uploads/images/book.png`
    it("should be successful ", async () => {
        const res = await request(app).post("/api/places").send({
           // image : testImage,
            title: "mockTitle",
            description: "shush",
            address: "320 oldhhham road",
            creator: "6426f4ec1660fb3f9dfba68c"
        })
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2ZjRlYzE2NjBmYjNmOWRmYmE2OGMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ0aW1lU3BlbnQiOjM0MywibGFzdExvZ2luIjoiMjAyMy0wNC0xM1QxNjoxNTo1Mi4wMTFaIiwiaWF0IjoxNjgxODI5NjM3LCJleHAiOjE2ODE4MzMyMzd9.Rs_D1igaPwXBcAPl1HUMder8ukTb0pdyS5ONxE3vbN8")
        
        expect(res.statusCode).toBe(201);
    }, 1000);
});

//Edit Post token has to be of user who created post
describe("PATCH /", () => {
    it("edit post should be successful ", async () => {
        const res = await request(app).patch("/api/places/642f3f1297e235ea4501590a").send({
            title: "unitTest",
            description: "asdasdasdsacs",
        })
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2ZjRlYzE2NjBmYjNmOWRmYmE2OGMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ0aW1lU3BlbnQiOjM0MywibGFzdExvZ2luIjoiMjAyMy0wNC0xM1QxNjoxNTo1Mi4wMTFaIiwiaWF0IjoxNjgxODI5NjM3LCJleHAiOjE2ODE4MzMyMzd9.Rs_D1igaPwXBcAPl1HUMder8ukTb0pdyS5ONxE3vbN8")
        
        expect(res.statusCode).toBe(200);
    }, 1000);
});

//DeletePost token has to be of user who created post
describe("DELETE /", () => {
    it("should be successful ", async () => {
        const res = await request(app).delete("/api/places/642f3f1297e235ea4501590a").send({
   
        })
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2ZjRlYzE2NjBmYjNmOWRmYmE2OGMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ0aW1lU3BlbnQiOjM0MywibGFzdExvZ2luIjoiMjAyMy0wNC0xM1QxNjoxNTo1Mi4wMTFaIiwiaWF0IjoxNjgxODI5NjM3LCJleHAiOjE2ODE4MzMyMzd9.Rs_D1igaPwXBcAPl1HUMder8ukTb0pdyS5ONxE3vbN8")

        expect(res.statusCode).toBe(200);
    }, 1000);
});


//LikePost token cant be of user who creates post
describe("POST /", () => {
    it("like should be successful ", async () => {
        const res = await request(app).post("/api/places/642df9f45310285218c6ae65/like").send({

        })
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2ZjRlYzE2NjBmYjNmOWRmYmE2OGMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ0aW1lU3BlbnQiOjM0MywibGFzdExvZ2luIjoiMjAyMy0wNC0xM1QxNjoxNTo1Mi4wMTFaIiwiaWF0IjoxNjgxODI5NjM3LCJleHAiOjE2ODE4MzMyMzd9.Rs_D1igaPwXBcAPl1HUMder8ukTb0pdyS5ONxE3vbN8")

        expect(res.statusCode).toBe(201);
    }, 1000);
});

//UnlikePost
describe("POST /", () => {
    it(" unlike should be successful ", async () => {
        const res = await request(app).post("/api/places/642df9f45310285218c6ae65/unlike").send({

        })
            .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI2ZjRlYzE2NjBmYjNmOWRmYmE2OGMiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ0aW1lU3BlbnQiOjM0MywibGFzdExvZ2luIjoiMjAyMy0wNC0xM1QxNjoxNTo1Mi4wMTFaIiwiaWF0IjoxNjgxODI5NjM3LCJleHAiOjE2ODE4MzMyMzd9.Rs_D1igaPwXBcAPl1HUMder8ukTb0pdyS5ONxE3vbN8")

        expect(res.statusCode).toBe(200);
    }, 1000);
});

//Add new User
describe("POST /", () => {
    it(" Add user should be successful ", async () => {
        const res = await request(app).post("/api/users/signup").send({
            email: "uniTest@googlemail.com",
            name: "shush shush",
            password: "12345"
        })

        expect(res.statusCode).toBe(201);
    }, 1000);
});

//login
describe("POST /", () => {
    it(" Add user should be successful ", async () => {
        const res = await request(app).post("/api/users/login").send({
            email: "test@test.com",
            password: "12345"
        })

        expect(res.statusCode).toBe(201);
    }, 1000);
});



