import request from "supertest"
import { app } from "../../app"

it("succeeds to signout", async () => {
  await request(app).post("/api/users/sign-out").send({}).expect(200)
})
it("Responds with a cookie to clear previous cookies", async () => {
  const response = await request(app)
    .post("/api/users/sign-out")
    .send({})
    .expect(200)

  expect(response.get("Set-Cookie")[0]).toEqual(
    "x76s26=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  )
})
