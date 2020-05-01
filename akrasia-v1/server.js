var express = require("express");
var app = express();
var HTTP_PORT = process.env.PORT || 8080

// Setup static content folder
app.use(express.static("public"));

// This handles a situation where the requestor sends
// a URL for a specific resource within the app
// The resource will not exist here at the server,
// because it exists only in the client device AFTER
// the Angular app is loaded
// So... handle all requests for anything other than the root
app.get('*', function (req, res) {
  console.log('Redirect was triggered');
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(HTTP_PORT, () => {
    console.log("Ready to handle requests on port " + HTTP_PORT);
});
