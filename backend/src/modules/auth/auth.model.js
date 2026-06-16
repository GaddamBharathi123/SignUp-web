

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Creates a unique index in MongoDB
      lowercase: true, // Always store emails in lowercase
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      /**
       * select: false — Mongoose will NEVER include `password` in query results
       * unless you explicitly call .select("+password").
       * This prevents accidental password leaks in API responses.
       */
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      /**
       * Also excluded from default queries for the same reason as password.
       * The service layer fetches it explicitly when validating a refresh request.
       */
      select: false,
    },
  },
  {
    /**
     * timestamps: true — Mongoose auto-manages `createdAt` and `updatedAt`.
     * No need to set them manually anywhere.
     */
    timestamps: true,

    /**
     * toJSON transform — runs whenever a document is serialised to JSON
     * (e.g. inside res.json()). We remove internal Mongoose fields that
     * clients don't need.
     */
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;    // Mongoose internal version key
        delete ret.password;      // Belt-and-suspenders safety
        delete ret.refreshToken;  // Never expose tokens in responses
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;