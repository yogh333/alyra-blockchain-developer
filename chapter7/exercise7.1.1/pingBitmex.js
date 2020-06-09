"use strict"

const fetch = require('node-fetch') 
const url = 'https://www.bitmex.com/api/v1/'

const pathParams = 'orderBook/L2' // Change based on desired pairs and precision
const queryParams = 'symbol=XBT&depth=2' // Change these based on relevant query params

async function request() {
    try {
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        var idx = 0;
        while (response[idx].side === 'Buy')
        	idx++;
        while ((response[idx].size / response[idx].price) < 0.0001)
        	idx++;
        console.log("BITMEX => Price of 0.0001 BTC = " + (0.0001*response[idx].price) + " $")
        console.log("BITMEX => For 20$ you can get = " + (20 / response[idx].price) + " BTC")
    }
    catch (err) {
        console.log(err)
    }
}

request()