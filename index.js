#!/usr/bin/env node
const glob = require("glob"),
  fs = require("fs"),
  figlet = require("figlet"),
  path = require("path"),
  prettier = require("prettier"),
  keywords = JSON.parse(fs.readFileSync("./keywords.json"));

const getFiles = async () =>
  new Promise((resolve, reject) =>
    glob(
      process.cwd() + "/**/*.stuetz",
      { ignore: process.cwd() + "/node_modules/**" },
      (err, matches) => (err && reject(err)) || (matches && resolve(matches))
    )
  );

const getContent = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(
      path,
      (err, data) => (err && reject(err)) || (data && resolve(data))
    )
  );

const transform = async (file) => ({
  path: path.join(
    process.cwd(),
    "dist",
    file.replace(process.cwd(), "").replace(/\.stuetz$/, ".js")
  ),
  file: file.replace(process.cwd(), ""),
  content: String(await getContent(file)),
});

const transpile = (file) => {
  Object.entries(keywords).map(
    ([key, value]) =>
      (file = {
        ...file,
        content: file.content.replace(new RegExp(key, "g"), value),
      })
  );
  return file;
};

const saveFile = (file) =>
  new Promise((resolve, reject) => {
    console.info(`[StuetzScript] FILEBROWSER GEH GEFÄLLIGST AUF!`);

    fs.mkdir(
      file.path.substring(0, file.path.lastIndexOf(path.sep)),
      { recursive: true },
      (err) => {
        if (err) return reject(err);

        console.info(
          `[StuetzScript] IS DES A QUARKUS?!: ${
            file.file
          } ==> ${file.path.replace(process.cwd(), "")}`
        );
        fs.writeFile(
          file.path,
          prettier.format(file.content, { parser: "babel" }),
          (err, data) => (err && reject(err)) || (data && resolve(data))
        );
      }
    );
  });

(async () => {
  try {
    figlet("StuetzScript", function (err, data) {
      if (err) {
        console.info(`[StuetzScript] MI NERVT DES! SEIT JAHREN RED MA DRÜBER!`);
        return;
      }
      console.log(data);
    });
    const files = (await getFiles()).map(path.normalize);
    (await Promise.all(files.map(transform))).map(transpile).map(saveFile);

    let counter = 3;
    let intervallCounter = setInterval(() => {
      if (counter >= 0) {
        console.info(`[StuetzScript] ${counter}...`);
        counter--;
      } else {
        clearInterval(intervallCounter);
        console.info(`[StuetzScript] JETZT OBA! : ${files.length}`);
        counter = 3;
      }
    }, 1000);
  } catch (err) {
    console.error(`[StuetzScript] MI NERVT DES! SEIT JAHREN RED MA DRÜBER!`);
    throw err;
  }
})();
