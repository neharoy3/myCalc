const display = document.getElementById("display");

function appendToDisplay(input){
    display.value += input;
}

function clearDisplay(){
    display.value = "";
}

function calculate(){
    try{
        let expression = display.value;

        expression = expression.replace(/×/g, "*");
        expression = expression.replace(/÷/g, "/");
        expression = expression.replace(/−/g, "-");

        let result = eval(expression);

        //only 4 decimal places
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(4));
        }

        display.value = result;
    }
    catch{
        display.value = "INVALID INPUT";
        setTimeout(() => {
            clearDisplay();
        }, 2000);
    }
}
