"use strict"

const fetch = require('node-fetch') 
const url = 'https://data.messari.io/api'
const ver = 'v1'

const pathParams = 'assets/BTC/metrics' // Change based on desired pairs and precision
const queryParams = 'fields=name,slug,symbol,market_data/price_usd,supply/y_2050,supply/y_2050_issued_percent,all_time_high/price' // Change these based on relevant query params

async function request() {
    try {
        const req = await fetch(`${url}/${ver}/${pathParams}?${queryParams}`)
        const response = await req.json()
        console.log(response)
    }
    catch (err) {
        console.log(err)
    }
}

request()