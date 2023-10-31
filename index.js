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

app.get("/", async (req, res) => {
    try {
        const response = await axios.get("https://www.frankfurter.app/currencies");
        console.log(response.data);
        const currencies = Object.keys(response.data);
        const currencyName = Object.values(response.data);
        const data = {
            content: {
                currency: currencies,
                currencyName: currencyName,
            }
        }        
        res.render("index.ejs", data);
    } catch (error) {
        if(error.response) {
            console.error(error.response.data)
        } else if(error.request){
            console.log("Request not sent: ")
        } else {
            console.error(error.message);
        }

    }

})

app.get("/chart", (req, res)=>{
    res.render("index.ejs");
})







app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})