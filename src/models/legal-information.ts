import mongoose from "mongoose";

const legalInformationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const LegalInformation =
  mongoose.models.LegalInformation ||
  mongoose.model("LegalInformation", legalInformationSchema);
