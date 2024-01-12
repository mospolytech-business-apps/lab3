const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const jsonServer = require("json-server");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = 3002;

let endpoints = [];
let obj = {};
let files = fs.readdirSync(path.resolve(__dirname, "./db/"));

console.log("\n");

files.forEach((file) => {
  if (file.indexOf(".json") > -1) {
    jsonObject = JSON.parse(fs.readFileSync("./db/" + file));

    if (isJson(fs.readFileSync("./db/" + file))) {
      Object.keys(jsonObject).forEach(function (idx) {
        endpoints.push(idx);
      });
      console.log("🗒    JSON file loaded : " + file);
      _.extend(obj, require(path.resolve(__dirname, "./db/", file)));
    }
  }
});

const objOrdered = {};
Object.keys(obj)
  .sort()
  .forEach(function (key) {
    objOrdered[key] = obj[key];
  });

const router = jsonServer.router(objOrdered);

// Middleware to handle JSON Server defaults
server.use(middlewares);

// Middleware to handle custom routes before the JSON Server router
server.use((req, res, next) => {
  // Handle image requests
  if (req.method === "GET" && req.url.startsWith("/images/")) {
    const imageName = req.url.split("/images/")[1];
    const imagePath = path.resolve(
      __dirname,
      `./public/assets/images/${imageName}`
    );

    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
    } else {
      res.status(404).send("Image not found");
    }
  } else {
    next();
  }
});

const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/assets/images/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

// Upload endpoint
server.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  res.json({
    message: "File uploaded successfully!",
    url: `/images/${file.filename}`,
  });
});

// Middleware to handle JSON Server router
server.use(router);

server.listen(port, () => {
  console.log("\n⛴    JSON Server is running at http://localhost:" + port);
  endpoints.sort();
  for (var i = 0; i < endpoints.length; i++) {
    console.info(
      "🥁    Endpoint : http://localhost:" + port + "/" + endpoints[i]
    );
  }
});

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
