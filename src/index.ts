import mongoose from "mongoose"
import { DatabaseConnectionError } from "@vanguardo/common"

import { app } from "./app"

const start = async () => {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET environment variable missing")
  if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI environment variable missing")
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("connected to mongodb")
  } catch (err) {
    console.log("[Error]", err)

    throw new DatabaseConnectionError()
  }

  app.listen(1366, () => {
    console.log("Listening on Auth service!!!")
  })
}

start()
