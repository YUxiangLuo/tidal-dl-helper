const list = require("./list");
const download_func = require("./download");
async function main() {
  for (const item of list) {
    await download_func(item);
  }
}
main();