const child_process = require('child_process');
const list = require("./list");
let now_url;
let go = false;
function main() {
    setTimeout(async () => {
        for(const item of list) {
            await downloadAlbum(item);
        }        
    }, 10000);
}

let time_out_timer;
function downloadAlbum(url) {
    const p = child_process.spawn("tidal-dl");
    let c = 0;
    p.stdout.on('data', (chunk) => {
        clearTimeout(time_out_timer);
        let s = chunk.toString("utf-8").trim();
        console.log(s);
        if(s.indexOf("Enter Choice:")!==-1) {
            c+=1;
            if(now_url&&c>1) {
                console.log(now_url+"=======完成======");
                go = true;
            }
        }
        if(s.indexOf("[ERR]")!==-1) {
            console.log("发生错误在下载"+now_url);
            process.exit(1);
        }
        time_out_timer = setTimeout(() => {
            console.log(now_url+"超时了，15秒没有任何输出，可能是下载完成了");
            process.exit(1);
        }, 60000);
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("现在开始下载"+url);
            now_url = url;
            console.log(p.stdin.writable);
            p.stdin.write(url);
            p.stdin.end("\n");
            let go_timer = setInterval(() => {
                console.log(go);
                if(go) {
                    clearInterval(go_timer);
                    go = false;
                    p.kill();
                    resolve(url+"======OK======");
                }
            }, 5000);
        }, 2000);
    })
}

main();