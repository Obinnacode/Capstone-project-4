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
//Create middleware to retrieve data before route handlers.
let getData = async (req, res, next) => {
    //Check first if content is available. So If content is not available, 'if' block will run.
    if (!content) {
        try {
            //Get the all the API supported currencies
            const axiosResponse = await axios.get("https://www.frankfurter.app/currencies");
            //Get the latest prices from API. Prices use base currency of Euro.
            const latestPrices = await axios.get("https://www.frankfurter.app/latest");
            console.log("Data is ready");
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
            };            

        } catch (error) {
            if (error.response) {
                console.error(error.response.data)
            } else if (error.request) {
                console.log("Request not sent")
            } else {
                console.error(error.message);
            }
        }
    }
    
    next(); // Continue to the next middleware or route handler
}

app.use(getData);


app.get("/", (req, res) => {

    res.render("index.ejs", {
        content: content,
        convertCheck: "checked",
    });

})

app.post("/converter", (req, res) => {

    console.log("request body: ", req.body);
    const amount = req.body.amount;
    const currency1 = req.body.dropdown1;
    const currency2 = req.body.dropdown2;
    let convertedValue = "";
    let currentPrice;
    //If blocks to convert currencies accordingly since default base currency of API is in EUR.
    if (currency1 === "EUR") {
        if (currency2 === "EUR") {
            convertedValue = `${amount} EUR = ${amount} EUR`;
            currentPrice = 1;
        } else {
            convertedValue = `${amount} EUR = ${+((amount * content.prices[currency2]).toFixed(2))} ${currency2}`;
            currentPrice = content.prices[currency2];
            console.log(convertedValue);
        }
    } else if (currency2 !== "EUR") {
        const currencyToEUR = amount / content.prices[currency1];
        currentPrice = (1 / content.prices[currency1]) * content.prices[currency2];
        //Calculate the converted value of the selected base currency. Note the use of unary plus operator '+' used to convert the string value of toFixed() method to a number
        convertedValue = `${amount} ${currency1} = ${+((currencyToEUR * content.prices[currency2]).toFixed(2))} ${currency2}`
        console.log(convertedValue);
    } else {
        //if currency2 is EUR
        const currencyToEUR = amount / content.prices[currency1];
        currentPrice = (1 / content.prices[currency1]);
        convertedValue = `${amount} ${currency1} = ${+(currencyToEUR.toFixed(2))} ${currency2}`;
        console.log(convertedValue);
    }


    res.render("index.ejs", {
        content: content,
        conversion: convertedValue,
        currency1: currency1,
        currency2: currency2,
        convertCheck: "checked",
        currentPrice: +(currentPrice.toFixed(5)),
    });


})

app.post("/chart", async (req, res) => {
    const currency1 = req.body.dropdown1;
    const currency2 = req.body.dropdown2;
    let labels;
    let chartDataValues = [];
    if (currency1 === currency2) {
        try {
            console.log("Currencies are the same!")
            const chartData = await axios.get(`https://www.frankfurter.app/2021-01-01..?from=${currency1}`);
            //Extract each date key from data to form Chart Labels array.
            labels = Object.keys(chartData.data.rates);
            //Push 1 for each label tag
            for (let i = 0; i < labels.length; i++) {
                chartDataValues.push(1);
            }
            res.render("index.ejs", {
                content: content,
                labels: JSON.stringify(labels), //Send data as JSON string, so EJS engine can process it properly.
                data: JSON.stringify(chartDataValues), //Send data as JSON string, so EJS engine can process it properly.
                currency1: currency1,
                currency2: currency2,
                chartCheck: "checked",
            })

        } catch (error) {
            if (error.response) {
                console.error(error.response.data)
            } else if (error.request) {
                console.log("Request not sent")
            } else {
                console.error(error.message);
            }
        }
    } else {
        try {
            const chartData = await axios.get(`https://www.frankfurter.app/2021-01-01..?from=${currency1}&to=${currency2}`);
            //Extract each date key from data to form Chart Labels array.
            labels = Object.keys(chartData.data.rates);
            //Get chart data for each date.
            const chartValues = Object.values(chartData.data.rates);
            chartDataValues = chartValues.map(obj =>
                Object.values(obj)[0]
            );
            console.log(labels);
            console.log(chartDataValues);
            res.render("index.ejs", {
                content: content,
                labels: JSON.stringify(labels),
                data: JSON.stringify(chartDataValues),
                currency1: currency1,
                currency2: currency2,
                chartCheck: "checked",
            })
        } catch (error) {
            if (error.response) {
                console.error(error.response.data)
            } else if (error.request) {
                console.log("Request not sent")
            } else {
                console.error(error.message);
            }
        }

    }

})
//Redirect users to homepage when invalid get route is used.
app.get("*", (req, res) => {
    res.redirect("/")
})







app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})