const child_process = require('child_process');
const p = child_process.spawn("tidal-dl");
p.stdout.pipe(process.stdout);
const list = require("./list");
console.log(list.length);

function main() {
    setTimeout(async () => {
        for(const item of list) {
            let url = await downloadAlbum(item);
            console.log(url);
        }        
    }, 5000);
}

function downloadAlbum(url) {
    return new Promise((resolve, reject) => {
        p.stdin.write(url);
        p.stdin.end();
        setTimeout(() => {
            resolve(url);
        }, 20*60*1000);
    })
}

main();