import express from 'express';
import cookies from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookies());


app.use("/api/products", (await import("./routes/product.routes.js")).default);
app.use("/api/auth", (await import("./routes/auth.routes.js")).default);

export default app;