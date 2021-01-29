import request from "supertest"
import { app } from "../../app"

it("Returns 201 on success", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)
})

it("Returns 422 with no email", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({
      emal: "test@test.com",
      password: "1234567890"
    })
    .expect(422)
})

it("Returns 422 with no password", async () => {
  return request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      assword: "1234567890"
    })
    .expect(422)
})

it("Returns 422 with invalid email or password", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test",
      assword: "1234567890"
    })
    .expect(422)
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      assword: "12"
    })
    .expect(422)
})

it("Returns 422 with duplicate email", async () => {
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)
  await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(422)
})

it("Sets a cookie on successful signup", async () => {
  const response = await request(app)
    .post("/api/users/sign-up")
    .send({
      email: "test@test.com",
      password: "1234567890"
    })
    .expect(201)

  expect(response.get("Set-Cookie")).toBeDefined()
})
