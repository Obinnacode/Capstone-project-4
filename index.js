import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import axiosRetry from "axios-retry";
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//Configure axios to retry failed requests up to three times before sending error.
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
//Declare an empty data object on a global scope so it is available to all other route handlers.
let content;

app.get("/", async (req, res) => {
    try {
        //Get the all the API supported currencies
        const axiosResponse = await axios.get("https://www.frankfurter.app/currencies");
        //Get the latest prices from API. Prices use base currency of Euro.
        const latestPrices = await axios.get("https://www.frankfurter.app/latest")
        //Store price rates only;
        const prices = latestPrices.data.rates;
        //Convert 'axiosResponse.data' object keys to an array so we can iterate over it for our EJS options.  
        const currencies = Object.keys(axiosResponse.data);
        //Convert 'axiosResponse.data' object values to an array for our EJS options content.
        const currencyName = Object.values(axiosResponse.data);
        content = {
            currency: currencies,
            currencyName: currencyName,
            prices: prices,
        }

        res.render("index.ejs", { content: content, });
    } catch (error) {
        if (error.response) {
            console.error(error.response.data)
        } else if (error.request) {
            console.log("Request not sent: ")
        } else {
            console.error(error.message);
        }

    }

})

app.post("/converter", async (req, res) => {

    console.log("request body: ", req.body);
    const amount = req.body.amount;
    const currency1 = req.body.dropdown1;
    const currency2 = req.body.dropdown2;
    let convertedValue = "";
    //If-blocks to convert currencies accordingly since default base currency is in EUR.
    if (currency1 === "EUR") {
        if (currency2 === "EUR") {
            convertedValue = `${amount} EUR = ${amount} EUR`
        } else {
            convertedValue = `${amount} EUR = ${+((amount * content.prices[currency2]).toFixed(2))} ${currency2}`;
            console.log(convertedValue);
        }
    } else if (currency2 !== "EUR") {
        const currencyToEUR = amount / content.prices[currency1];
        //Calculate the converted value of the selected base currency. Note the use of unary plus operator '+' used to convert the string value of toFixed() method to a number
        convertedValue = `${amount} ${currency1} = ${+((currencyToEUR * content.prices[currency2]).toFixed(2))} ${currency2}`
        console.log(convertedValue);
    } else {
        const currencyToEUR = amount / content.prices[currency1];
        convertedValue = `${amount} ${currency1} = ${+(currencyToEUR.toFixed(2))} ${currency2}`;
        console.log(convertedValue);
    }

    res.render("index.ejs", {
        content: content,
        conversion: convertedValue,
        currency1: currency1,
        currency2: currency2,
    });


})

app.post("/chart", async(req, res) => {
    const currency1 = req.body.dropdown1;
    const currency2 = req.body.dropdown2;
    const chartData = await axios.get(`https://www.frankfurter.app/2021-01-01..?from=${currency1}&to=${currency2}`)
    console.log(chartData.data);

})







app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})