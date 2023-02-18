import express from "express";
import mongoose from "mongoose";
import cors from "cors";

mongoose.set("strictQuery", false);

await mongoose.connect("mongodb://localhost/sigs");

const Schema = mongoose.Schema;

const txRecord = new Schema({
  receiver: String,
  amount: String
});

const TxRecord = new mongoose.model("TransactionRecord", txRecord);

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", async (req, res) => {
  const records = await TxRecord.find();
  if (!records || records.length == 0) {
    return res.status(404).send({ error: "No any txs" });
  }
  res.send({ records });
});

app.get("/get_record_by_hash/:hash", async (req, res) => {
  try {
    const record = await TxRecord.findOne({ hash: req.params.hash });
    if (!record) {
      return res.status(404).send({ error: "Ничего не найдено" });
    }
    res.send({ record });
  } catch (error) {
    console.error(error);
    res.status(404).send(error);
  }
});

app.post("/", async (req, res) => {
  const { receiver, amount } = req.body;
  if (!receiver || !amount) {
    return res.status(403).send({ error: "Нужно отправить и хэш и текст." });
  }
  const record = new TxRecord({ receiver, amount });
  try {
    await record.save();
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  res.send({ record });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
