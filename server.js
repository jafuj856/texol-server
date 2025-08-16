import "dotenv/config"; // loads .env automatically
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./src/config/db.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";
import authRoutes from "./src/routes/authRoute.js";
import productRoutes from "./src/routes/productRoute.js";
import cartRoutes from "./src/routes/cartRoute.js";
import orderRoutes from "./src/routes/orderRoute.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import path from "path";
import http from "http";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dbConnection
connectDB();

// soket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let adminSockets = [];

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("message", (data) => {
    const parsed = JSON.parse(data);
    if (parsed.event === "admin_join") {
      adminSockets.push(socket.id);
      console.log("Admin joined:", socket.id);
    }
  });

  socket.on("disconnect", () => {
    adminSockets = adminSockets.filter((id) => id !== socket.id);
    console.log("Client disconnected:", socket.id);
  });
});
app.set("io", io);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

// errorHandler
app.use(errorHandler);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// https://www.etsy.com/in-en/listing/1300620749/minimalist-shopify-theme-isla-website
