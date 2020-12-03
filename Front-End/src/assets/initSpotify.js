/*const {BrowserWindow} = require('electron').remote
let urlContainingAccessToken = "";

const options = {
    client_id: "d9b8ea58cd5a48fb94ad8fe63d88ce76",
    redirect_uri: "http://127.0.0.1/",
    scope: 'user-read-currently-playing'
}

var authWindow = new BrowserWindow({
    width: 450,
    height: 300,
    show: false,
    modal: true,
    webPreferences: {nodeIntegration: false, webSecurity: false, allowRunningInsecureContent: true}
});

var spotifyAuthURL = `https://accounts.spotify.com/authorize?client_id=${options.client_id}&response_type=token&scope=${options.scope}&redirect_uri=${options.redirect_uri}`;
authWindow.loadURL(spotifyAuthURL);
authWindow.show();
authWindow.webContents.on('will-redirect', (event, url) => {
    const accessTokenIndex = url.indexOf('#')
    url = url.substring(accessTokenIndex);
    urlContainingAccessToken = url;
    authWindow.close()
    authWindow.destroy()
})
*/
// let urlContainingAccessToken = "";
