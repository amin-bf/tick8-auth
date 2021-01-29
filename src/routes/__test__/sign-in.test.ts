import request from "supertest"
import { app } from "../../app"

it("Fails if non-existence email is provided", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(422)
})

it("Fails if wrong password is provided", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "wrongPassword"
    })
    .expect(422)
})

it("Fails with invalid email", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test",
      password: "1234567890"
    })
    .expect(422)
})
it("Fails if no password is provided", async () => {
  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: ""
    })
    .expect(422)
})
it("Passes when correct credentials is provided", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)

  await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(200)
})

it("Sets cookie on successful signin", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)

  const response = await request(app)
    .post("/api/users/sign-in")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(200)

  expect(response.get("Set-Cookie")).toBeDefined()
})
