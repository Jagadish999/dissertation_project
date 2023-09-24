# dissertation_project

# Make sure You have composer, mysql, xaamp and node js installed in your device

Node js:
https://nodejs.org/en/download/current

xampp(for php):
https://www.apachefriends.org/

composer:
https://getcomposer.org/download/

mysql:
https://dev.mysql.com/downloads/installer/


To confirm you have all the requirements you can run following commands in prompt:
Make sure you have everything provided in environment variable

Node js:
node --version

php:
php --version

composer
composer --version

Just make sure you have mysql properly installed as you need to provide username and password


#run this command in project directory
composer install


#make .envExample to .env
#provide mysql details in .env file


#__________________________________________________________________________________
#Now lets focus on running our project


#make sure you have vite package installed
#run: 
npm run build



#migrate all the tables
php artisan migrate

#command for seeders some data to insert in database:
php artisan db:seed --class=UsersTableSeeder
php artisan db:seed --class=PuzzleTableSeeder


# Open three command line in project directory
#_________For serving in browser_______________
php artisan serve

#______For running websocket_____________
php artisan websocket:serve

#_______For running stockfish_________________
cd node_server
node index.js