import express from 'express';

const app = express();
app.use(express.json());

app.use("/api/products", (await import("./routes/product.routes.js")).default);
app.use("/api/auth", (await import("./routes/auth.routes.js")).default);

export default app;