# csye6225-fall2018

## 1.Team member information

### Palak Sharma</br>
 - **Email Id** -  sharma.pala@husky.neu.edu
 - **NUID** - 001834478

### Garvit Chawla </br>
 - **Email Id**- chawla.g@husky.neu.edu
 - **NUID** - 001859169

### Yaggesh Likher</br>
 - **Email Id** - likhar.y@husky.neu.edu
 - **NUID** - 001812051

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
a. Get request</br>
 Run this url - http://localhost:4000/time </br>
 Result- current time should get displayed
 
b. Post request </br>
 Run this url - http://localhost:4000/user/register </br>
 Result: 1.User will registered if not existing </br>
         2. "User already exist" if user is present

c. Post request </br>
  a.Post request to login 
    Run this url - http://localhost:4000/api/login </br>
    Result: 1.User will be loggein </br>
            2. Get Request to check current time.
               Run this url - http://localhost:4000/time </br>

  b.GET Request to check current time without login.
    Run this url - http://localhost:4000/time </br>
    Result: 1. Remove the authorization. Result recieved will be "unauthorized".
    
