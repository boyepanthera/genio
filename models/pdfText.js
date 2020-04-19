import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pdfSchema = new Schema({
  data: String,
  Date: {
    type: Date,
    default: Date.now(),
  },
});

const PDF = mongoose.model("PDF", pdfSchema);

export default PDF;
