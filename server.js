import express from "express";
import { connectDB, prisma } from "./src/config/dbCofig.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) =>
  res.send(
    `<html>
      <header>
        <title>Job Reminder Microservice</title>
      </header>
      <body>
        <h1>Welcome to Job Reminder Microservice</h1>
      </body>
    </html>`
  )
);

app.get("/users", async (req, res) => {
  const tasks = await prisma.tasks.findMany({
    where: { reminded1hStart: false },
    include: { user: true },
  });
  return res.json({ tasks });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to mysql server:", error);
  });
