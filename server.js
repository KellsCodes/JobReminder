import express from "express";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5002;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
