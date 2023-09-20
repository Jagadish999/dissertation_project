# dissertation_project

#Make sure You have composer, mysql, xaamp and node js installed in your device

Node js:
https://nodejs.org/en/download/current

xampp:
https://www.apachefriends.org/

composer:
https://getcomposer.org/download/

mysql:
https://dev.mysql.com/downloads/installer/


To confirm you have all the requirements you can run following commands in prompt:

Node js:
node --version

xampp:
php --version

composer
composer --version

Just make sure you have mysql properly installed

#__________________________________________________________________________________
#Now lets focus on running our project



#command for seeders:
php artisan db:seed --class=UsersTableSeeder
php artisan db:seed --class=PuzzleTableSeeder
