const exec = require('child_process').exec;
const os = require('os');

const electronVersion = '13.1.2';

function callback(error, stdout, stderr) {
    if (error) {
        console.error(error);
    }
    console.log('stdout', stdout);
    console.log('stderr', stderr);
}

// Run command depending on the OS
if (os.type() === 'Linux') {
    exec(`./node_modules/.bin/electron-rebuild --target=${electronVersion}`, callback);
} else if (os.type() === 'Darwin') {
    exec(`./node_modules/.bin/electron-rebuild --target=${electronVersion}`, callback);
} else if (os.type() === 'Windows_NT') {
    exec(`node_modules\\.bin\\electron-rebuild --target=${electronVersion}`, callback);
} else {
    throw new Error('Unsupported OS found: ' + os.type());
}
