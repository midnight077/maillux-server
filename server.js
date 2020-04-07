const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config({ path: "./config/config.env" });
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
connectDB();
const PORT = process.env.PORT || 8800;
app.use("/api/courses", require("./routes/courses"));
app.use("/api/user", require("./routes/user"));
const { routineMail } = require("./config/email/routineMail");

const timeToNextIteration = 86400000;
const timeToStart = () => {
  const curr = new Date();
  [y, m, d] = [curr.getFullYear(), curr.getMonth(), curr.getDate()];
  const next = new Date(y, m, d, 8);
  if (next - curr < 0) return next - curr + 86400000;
  return next - curr;
};
console.log(timeToStart());
(async () => {
  setTimeout(async () => {
    const resp = await routineMail();
    console.log(resp);
    setInterval(async () => {
      const resp = await routineMail();
      console.log(resp);
    }, timeToNextIteration);
  }, timeToStart());
})();

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
