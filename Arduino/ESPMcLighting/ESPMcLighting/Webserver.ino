#include <WiFi.h>
#include <HTTPSServer.hpp>
#include <SSLCert.hpp>
#include <HTTPRequest.hpp>
#include <HTTPResponse.hpp>
//#include <WebServer.h>
#include <Ticker.h>

using namespace httpsserver;

Ticker ticker;

// Create an SSL certificate object from the files included above
SSLCert cert = SSLCert(
                 example_crt_DER, example_crt_DER_len,
                 example_key_DER, example_key_DER_len
               );

// Create an SSL-enabled server that uses the certificate
HTTPSServer secureServer = HTTPSServer(&cert);

// Declare some handler functions for the various URLs on the server
// The signature is always the same for those functions. They get two parameters,
// which are pointers to the request data (read request body, headers, ...) and
// to the response data (write response, set status code, ...)



void handle404(HTTPRequest * req, HTTPResponse * res);
void handle404(HTTPRequest * req, HTTPResponse * res) {
  // Discard request body, if we received any
  // We do this, as this is the default node and may also server POST/PUT requests
  req->discardRequestBody();

  // Set the response status
  res->setStatusCode(404);
  res->setStatusText("Not Found");

  // Set content type of the response
  res->setHeader("Content-Type", "text/html");

  // Write a tiny HTTP page
  res->println("<!DOCTYPE html>");
  res->println("<html>");
  res->println("<head><title>Not Found</title></head>");
  res->println("<body><h1>404 Not Found</h1><p>The requested resource was not found on this server.</p></body>");
  res->println("</html>");
}

void handleMode(HTTPRequest * req, HTTPResponse * res);
void handleMode(HTTPRequest * req, HTTPResponse * res) {
  // @see https://github.com/fhessel/esp32_https_server/blob/master/examples/REST-API/REST-API.ino
}

void setupWebserver() {
  Serial.print("Connecting to ");
  Serial.println(ssid);

  // This part of code will try create static IP address
  if (!WiFi.config(local_ip, gateway, subnet)) {
    Serial.println("STA Failed to configure");
  }
  Serial.println();
  WiFi.begin(ssid, password);

  ticker.attach_ms(250, connectingLed);
  while (WiFi.status() != WL_CONNECTED) {}
  ticker.detach();

  // Print local IP address and start web server
  Serial.println();
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // For every resource available on the server, we need to create a ResourceNode
  // The ResourceNode links URL and HTTP method to a handler function
  ResourceNode * nodeRoot    = new ResourceNode("/mode", "POST", &handleMode);
  ResourceNode * node404     = new ResourceNode("", "GET", &handle404);

  // Add the root node to the server
  secureServer.registerNode(nodeRoot);

  // Add the 404 not found node to the server.
  // The path is ignored for the default node.
  secureServer.setDefaultNode(node404);

  secureServer.start();
  if (secureServer.isRunning()) {
    Serial.println("Server ready.");
  } else {
    Serial.println("Secure server failed");
  }
}

void runWebserver() {
  secureServer.loop();
}

void connectingLed() {
  digitalWrite(BUILTIN_LED, !(digitalRead(BUILTIN_LED)));  //Invert Current State of LED
  Serial.print(".");
}
