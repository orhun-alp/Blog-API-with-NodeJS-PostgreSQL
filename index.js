const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use("/users", require("./routes/usersRoute"));
app.use("/posts", require("./routes/postsRoute"));


// Server Listening
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






