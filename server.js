const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello DevOps! This is Node.js App deployed via Jenkins Pipeline 🚀");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

