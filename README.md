# Reddington Project

## a) Introduction :
Reddington project is a proxy-scrapper project which surfes some websites(which are listed in src/data folder) and does some tasks which are:

* gathering proxies and store them in mongodb database in specific format ( id:ip, ip, port, country, anonymity, type, code )
* send these proxies to iprep project ( with GRPC protocol ), to save them as ip blacklists for further usages.

There are 2 ways to gather proxies:

+ using axios
+ using puppeteer

some of these sites have their own API, so we can use axios and get them. but some of these websites just have a table, so we should scrap them by puppeteer which is disabled right now!

if you also want to scrap websites with table data, you should first install puppeteer then uncomment the puppeteer code section.

## b) Requirements :
I suggest using node v16.15.0 and npm8.5.5 which workes fine.
but it shouldn't be problem using other versions.

1- install node and npm

2- make .env file and set your environment variables according to .env.example file

3- run:
```javascript
npm install
```

* if you also want to use puppeteer you should call <b>puppeteerReqs()</b> function too.


4- run:
```javascript
node app.js
```

## c ) Running Strategy :
this project is using Cron job-manager which calls the function every hour. the time can also be managed in .env file.
