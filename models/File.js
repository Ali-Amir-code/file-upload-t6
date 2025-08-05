// models/File.js
import { Schema, model } from "mongoose";

const FileSchema = new Schema({
    name: { type: String, required: true },
    file: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadAt: { type: Date, default: Date.now }
});

export default model("Upload", FileSchema);
