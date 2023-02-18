import express from "express";
import url from "url";
import path from "path";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// initialize express app
const app = express();

// body parsing middleware
app.use(express.urlencoded({extended: false}));

// static file-serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// start app
app.listen(process.env.PORT || 3000);