# csye6225-fall2018

## 1.Team member information

### Palak Sharma</br>
 - **Email Id** -  sharma.pala@husky.neu.edu
 - **NUID** - 001834478

### Garvit Chawla </br>
 - **Email Id**- chawla.g@husky.neu.edu
 - **NUID** - 001859169

### Dhanisha Phadate</br>
 - **Email Id** -phadate.d@husky.neu.edu
 - **NUID** - 001859234

## 2.Prerequisites for building and deploying your application locally. </br>
Software : NodeJS, AngularJS , Mariadb
Initial Commands -
```
npm install 
 ```
To start db server : 
```
mysql.server start
```
To get into mariadb terminal:
```
mysql -u root
```
## 3.Build and Deploy instructions for web application. </br>
Running on: https://localhost:4000

## 4.Instructions to run unit, integration and/or load tests. </br>
a. Post request</br>
 Result- Register the user , with username as email and password.
 
b. Post request</br>
 Result- Login the app with the credentials(Hashed passwords will be compared)
 
c. Post request</br>
 Result- Go to the transactions page, and enter all the values
 
d. Get request</br>
 Result- Get the transactions for the user.
 
e. Perform CRUD operations on the transactions(Create, Delete, Update and Read)
FOR EACH TRANSACTION :
With : NODE_ENV=dev node server.js(Uploading the images on S3 bucket for which credentials are stored in ENV variables.)
With : node server.js(Storing the attachments locally)
 a. POST request : Add a png or jpeg file displying the receipt of the transaction.
 b. GET request : Display all the added attachments for the particular transaction once the user click on the hyperlink.
 c. PUT request : Request to update the exixting attachment with a new one.
 d. DELETE request : Delete the attachment for the particular transaction.
 
f. Added Authentication to destroy the session of the user once "LOGOUT".



 

    
