#include <pgmspace.h>
char index_html[] PROGMEM = R"=====(
<!doctype html>
<html lang='en' dir='ltr'>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
    <title>Configure</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <h1>Configure</h1>
    <form action='/configure' method='get'>
        <div class='form-group'>
            <label for='ssid'>SSID</label>
            <input type='text' class='form-control' id='ssid' name='ssid' placeholder='SSID'>
        </div>
        <div class='form-group'>
            <label for='password'>Password</label>
            <input type='password' class='form-control' id='password' name='password' placeholder='Password'>
        </div>
        <div class='form-group'>
            <label for='ledPin'>LED Pin</label>
            <input type='number' class='form-control' id='ledPin' name='ledPin' placeholder='LED Pin' min="0" value="26">
        </div>
        <div class='form-group'>
            <label for='ledCount'>LED Count</label>
            <input type='number' class='form-control' id='ledCount' name='ledCount' placeholder='LED Count' min="0" value="30">
        </div>
        <div class='form-group'>
            <label for='serverip'>Server API IP</label>
            <input type='text' class='form-control' id='serverip' name='serverip' placeholder='IP or domain of API to connect to (without port)'>
        </div>
        <div class='form-group'>
            <label for='serverport'>Server API Port</label>
            <input type='number' class='form-control' id='serverport' name='serverport' placeholder='Port of the API server to connect to'>
        </div>
        <button type='submit' class='btn btn-primary mt-3'>Submit</button>
    </form>
</div>
</body>
</html>
)=====";
