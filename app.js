import { countryList } from "./codes.js";

const baseUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

const dropdowns = document.querySelectorAll('#dropdown select');
const btn = document.querySelector('form button');
const fromCurr = document.querySelector('#from select');
const toCurr = document.querySelector('#to select');
const roe = document.querySelector('form #roe');
const exchange = document.querySelector('#dropdown i');


dropdowns.forEach((select) => {
    for (let currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerHTML = currcode;
        newOption.value = currcode;
        if(select.name==="from" && currcode==="USD") {
            newOption.selected = "selected";
        }
        if(select.name==="to" && currcode==="INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
});


function updateFlag(element) {
    const currCode = element.value;
    const countryCode = countryList[currCode];

    const img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}


exchange.addEventListener('click', () => {
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    
    updateFlag(fromCurr);
    updateFlag(toCurr);
});


btn.addEventListener("click", async (event) => {

    event.preventDefault();                // this prevents default behaviour of form - like refreshing, urlParameters,etc.
    updateExchangeRate();
});


async function updateExchangeRate() {

    const input = document.querySelector("#amount input");
    let amount = input.value;
    if (amount === "" || amount < 1) {
        amount = 1;
        input.value = 1;
    }
    
    const fromVal = fromCurr.value.toLowerCase();
    const toVal = toCurr.value.toLowerCase();

    const url = `${baseUrl}/${fromVal}.json`;
    const response = await fetch(url);
    const data = await response.json();

    // data.fromVal.toVal                 ** doesnt work because **    -->    Dot notation would literally look for a property called fromVal in the object, which doesn't exist, whereas Bracket notation treats fromVal and toVal as variables.
    const rate = data[fromVal][toVal];
    const finalAmount = (amount * rate).toFixed(2);

    roe.innerText = `${amount} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
}



// SET THE FOCUS ON INPUT BOX ON LOADING...

window.addEventListener('load', (event) => {
    document.querySelector('#amount input').focus();
    updateExchangeRate();
});

// OR ANOTHER WAY OF DOING THE SAME THING IS  -->
window.onload = () => {
    document.querySelector('#amount input').focus();
};
