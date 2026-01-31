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

const bracketBtn = document.getElementById("bracketBtn");

bracketBtn.addEventListener("click", () => {
    const value = display.value;
    const lastChar = value.slice(-1);

    // Count open and close brackets
    const openBrackets = (value.match(/\(/g) || []).length;
    const closeBrackets = (value.match(/\)/g) || []).length;

    // Decide whether to open or close
    if (
        value === "" ||
        "+-*/(".includes(lastChar) ||
        openBrackets === closeBrackets
    ) {
        appendToDisplay("(");
    } else {
        appendToDisplay(")");
    }
});

