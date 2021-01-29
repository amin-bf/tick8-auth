import mongoose from "mongoose"
import { Password } from "../services/password"

// An interface to describe the properties of new user
interface IUserAttrs {
  email: string
  password: string
}

// An interface to describe the properties of User Model
interface UserModel extends mongoose.Model<IUserDoc> {
  build(userAttrs: IUserAttrs): IUserDoc
}

// An interface to describe properties of UserDoc
interface IUserDoc extends mongoose.Document {
  id: object
  email: string
  password: string
  updatedAt: string
  createdAt: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret, options) => {
        delete ret.password
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"))
    this.set("password", hashed)
  }
  done()
})
userSchema.statics.build = (userDoc: IUserAttrs) => {
  return new User(userDoc)
}

const User = mongoose.model<IUserDoc, UserModel>("User", userSchema)

export { User, IUserDoc }
