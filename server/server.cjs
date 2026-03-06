const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const path = require("path");

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const rules = auth.rewriter({
  users: 600,
  clients: 660,
  credits: 660,
});

app.db = router.db;

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);

app.listen(3001, () => {
  console.log("JSON Server running on http://localhost:3001");
});