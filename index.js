const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const testServerBaseURL = 'http://20.244.56.144/test';
const windowSize = 10;
const timeout = 500;

const authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMTM5MTA0LCJpYXQiOjE3MjExMzg4MDQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjA3ZDUxMDFjLTNjNmUtNDZmNi1hN2FhLTU2NmZlYTYyNjc1ZCIsInN1YiI6IjEyNTAxNTE2NkBzYXN0cmEuYWMuaW4ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjA3ZDUxMDFjLTNjNmUtNDZmNi1hN2FhLTU2NmZlYTYyNjc1ZCIsImNsaWVudFNlY3JldCI6IktqbVluYUdDa1VXTnN4emIiLCJvd25lck5hbWUiOiJNU2FuZGVlcCIsIm93bmVyRW1haWwiOiIxMjUwMTUxNjZAc2FzdHJhLmFjLmluIiwicm9sbE5vIjoiMSJ9.ds1DpydvCwLj2d2OvDKCh-g5crG_sfZ9AzUD6nVV5a8";

let windowState = [];

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`${testServerBaseURL}/${type}`, {
            headers: {
                'Authorization': `Bearer ${authorizationToken}`
            },
            timeout
        });
        if (response.data && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};

const updateWindowState = (numbers) => {
    windowState = [...new Set([...windowState, ...numbers])].slice(-windowSize);
};

const calculateAverage = () => {
    const sum = windowState.reduce((acc, num) => acc + num, 0);
    return windowState.length ? sum / windowState.length : 0;
};

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = {
        "r": "rand",
        "e": "even",
        "f": "fibo",
        "p": "primes"
    };

    if (!validTypes[type]) {
        return res.status(400).send('Invalid type');
    }

    const numbers = await fetchNumbers(validTypes[type]);
    const windowPrevState = [...windowState];

    updateWindowState(numbers);

    const avg = calculateAverage();
    const windowCurrState = [...windowState];

    res.json({
        numbers,
        windowPrevState,
        windowCurrState,
        avg
    });
});

app.listen(port, () => {
    console.log(`Average Calculator microservice listening at http://localhost:${port}`);
});
