const child_process = require("child_process");
const notifier = require("node-notifier");
let time_to_next = false;
let time_out_timer;
module.exports = async function (url) {
  child_process.spawn("killall", ["tidal-dl"]);
  const p = child_process.spawn("tidal-dl");
  let c = 0;
  p.stdout.on("data", (chunk) => {
    clearTimeout(time_out_timer);
    let s = chunk.toString("utf-8").trim();
    console.log(s);
    if (s.indexOf("Enter Choice:") !== -1) {
      c += 1;
      if (c > 1) {
        console.log(url + "-------------Successfully download-------------");
        notifier.notify({
          title: "Successfully downloaded a url",
          message: url,
        });
        time_to_next = true;
      }
    }
    if (s.indexOf("[ERR]") !== -1) {
      console.log(url + "------------Error----------");
      notifier.notify({
        title: "Error occurs when download a url",
        message: url,
      });
      process.exit(1);
    }
    time_out_timer = setTimeout(() => {
      console.log(url + "------------Time limit reaches---------");
      notifier.notify({
        title: "Time Limit reaches",
        message: "Job is over or network problem.",
      });
      process.exit(1);
    }, 40000);
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("-------start downloading--------" + url);
      console.log(p.stdin.writable);
      p.stdin.write(url);
      p.stdin.end("\n");
      let t = setInterval(() => {
        if (time_to_next) {
          clearInterval(t);
          time_to_next = false;
          resolve();
        }
      }, 5000);
    }, 6000);
  });
};
