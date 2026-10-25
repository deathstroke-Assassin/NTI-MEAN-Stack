const os = require('os')
console.log(`the system uptime is : ${Math.round(os.uptime() / 3600)} hour`);
console.log(os.userInfo());
const currentOS = {
    name: os.type(),
    release: os.release(),
    freeMem: os.freemem() / 1000000000,
    totalMem: os.totalmem() / 1000000000
}
console.log(currentOS);