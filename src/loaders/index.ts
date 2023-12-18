import http from "http";
import app from "./app";
import db from "./mongodb";

export default async () => {
  const port = process.env.PORT ?? 8000;
  const server = http.createServer(app);

  // Connect to mongoDb
  const mongoDb = await db();

  if (mongoDb) {
    server.listen(port, () => {
      process.stdout.write(`Server started on port http://localhost:${port}\n`);
    });
  }

  // Majestic close
  process.on("SIGINT", () => {
    server.close();
    void mongoDb.close();
  });
};
