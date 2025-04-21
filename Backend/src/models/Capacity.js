import mongoose from "mongoose";

const capacitySchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("Capacity", capacitySchema);
