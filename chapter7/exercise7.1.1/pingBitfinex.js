"use strict"

const fetch = require('node-fetch') 
const url = 'https://api-pub.bitfinex.com/v2/'

const pathParams = 'book/tBTCUSD/P0' // Change based on desired pairs and precision
const queryParams = '' // Change these based on relevant query params

async function request() {
    try {
        const req = await fetch(`${url}/${pathParams}?${queryParams}`)
        const response = await req.json()
        var idx = 0;
        while (response[idx][2] > 0)
        	idx++;
        while (Math.abs(response[idx][2]) < 0.0001)
        	idx++
        console.log("BITFINEX => Price of 0.0001 BTC = " + (0.0001*response[idx][0]) + " $")
        console.log("BITFINEX => For 20$ you can get = " + 20/response[idx][0] + " BTC")
    }
    catch (err) {
        console.log(err)
    }
}

request()