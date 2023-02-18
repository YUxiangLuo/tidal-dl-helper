const child_process = require('child_process');
const p = child_process.spawn("tidal-dl");
let now_url;
let go = false;
let time_out_timer;
// p.stdout.pipe(process.stdout);
p.stdout.on('data', (chunk) => {
    clearTimeout(time_out_timer);
    let s = chunk.toString("utf-8");
    console.log(s);
    if(s.indexOf("Enter Choice:")!==-1) {
        if(now_url) {
            console.log(now_url+"=======完成======");
            go = true;
        }
    }
    if(s.indexOf("[ERR]")!==-1) {
        console.log("发生错误在下载"+now_url);
        process.exit(1);
    }
    time_out_timer = setTimeout(() => {
        console.log(now_url+"超时了，15秒没有任何输出");
        process.exit(1);
    }, 60000);
});
const list = require("./list");
console.log(list.length);

function main() {
    setTimeout(async () => {
        for(const item of list) {
            now_url = item;
            await downloadAlbum(item);
        }        
    }, 10000);
}

function downloadAlbum(url) {
    console.log("现在开始下载"+url);
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(p.stdin.writable);
            p.stdin.write(url);
            p.stdin.end("\n");
            let go_timer = setInterval(() => {
                console.log(go, go_timer);
                if(go) {
                    clearInterval(go_timer);
                    go = false;
                    resolve(url+"======OK======");
                }
            }, 5000);
        }, 2000);

    })
}

main();