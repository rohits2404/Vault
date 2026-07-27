import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

const refreshSessionSchema = new Schema(
    {
        tokenHash: { type: String, required: true },
        userAgent: { type: String, default: "unknown" },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
    },
    { _id: true }
);

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 60 },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
        },
        password: { type: String, required: true, minlength: 8, select: false },
        refreshSessions: { type: [refreshSessionSchema], default: [] },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return compare(candidate, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
    return { id: this._id, name: this.name, email: this.email, createdAt: this.createdAt };
};

export default model("User", userSchema);
