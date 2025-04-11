import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema({
  amount: Number,
  platform: String,
  date: { type: Date, default: Date.now }
});

const Earning = mongoose.model("Earning", EarningSchema);

export default Earning;
