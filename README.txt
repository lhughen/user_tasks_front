This is a simple CRUD for Users and Tasks, the framework used is React.

Because of the CORS limitation, this app needs to be run on a domain (It can local domain defined on your /etc/hosts).
Also you will need a webserver (Apace, Nginx) with the webroot pointing to index.html.
The index.php was a workaround to host this app on Heroku, it is not needed.

With this app and its Back End counterpart set up, you need to change the "apiUrl" on app/main.js.
