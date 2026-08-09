import fs from "fs";

const css = fs.readFileSync("styles.css", "utf8").trim();
let html = fs.readFileSync("index.html", "utf8");

const styleBlock = `    <style>\n${css}\n    </style>`;

const criticalAndLink =
  /    <style>[\s\S]*?<\/style>\s*<link\s+rel="stylesheet"\s+href="styles\.css"\s+media="print"\s+onload="this\.media='all'"\s*\/>\s*<noscript><link rel="stylesheet" href="styles\.css" \/><\/noscript>/;

const plainLink = '    <link rel="stylesheet" href="styles.css" />';

if (criticalAndLink.test(html)) {
  html = html.replace(criticalAndLink, styleBlock);
} else if (html.includes(plainLink)) {
  html = html.replace(plainLink, styleBlock);
} else if (html.includes("    <style>") && html.includes("--sky:")) {
  html = html.replace(/    <style>[\s\S]*?<\/style>/, styleBlock);
} else {
  throw new Error("No stylesheet insertion point found in index.html");
}

fs.writeFileSync("index.html", html);
console.log(`Synced styles.css (${css.length} bytes) into index.html`);
