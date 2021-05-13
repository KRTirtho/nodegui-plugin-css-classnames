import fs from "fs";
import path from "path";
import { Css } from ".";

console.time("labelName")

const cssFilePath = path.join("assets", "test.css");
const importedCss = fs.readFileSync(cssFilePath, "utf-8");

const x = new Css(importedCss);

console.log(x.styleByClass("link-danger link-dark ratio"));
console.timeEnd("labelName")