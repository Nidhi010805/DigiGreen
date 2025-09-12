import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import likeRoutes from "./routes/likesRoutes.js";
// import returnPackagingRoutes from "./routes/returnPackagingRoutes.js";
import redeemRoutes from "./routes/redeemRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import retailerRoutes from "./routes/retailerRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";



dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://reloop-omega.vercel.app"
];
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps, Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }

//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());

app.use("/api/retailers", retailerRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/likes", likeRoutes);
// app.use("/api/returnpackaging", returnPackagingRoutes);
app.use("/api/redeem", redeemRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("✅ Server is running successfully!");
});



// ✅ Setup HTTP server for socket
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Socket Events
io.on("connection", (socket) => {
 

  socket.on("join", (userId) => {
   
    socket.join(`user-${userId}`);
  });

  socket.on("disconnect", () => {
    
  });
});

app.set("io", io); // Global io access for controllers

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
