const display = document.getElementById("display");

function appendToDisplay(input){
    //block extra decimals
    if(input=="."){
        const value = display.value;
        const parts = value.split(/[+\-×÷]/);
        const lastNum = parts[parts.length-1];
        if(lastNum.includes(".")){
            return;
        }
    }
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
        display.value = "INVALID FORMAT";
        setTimeout(() => {
            clearDisplay();
        }, 2000);
    }
}

//brackets button
const bracketBtn = document.getElementById("bracketBtn");

bracketBtn.addEventListener("click", () => {
    const value = display.value;
    const lastChar = value.slice(-1);

    const openBrackets = (value.match(/\(/g) || []).length;
    const closeBrackets = (value.match(/\)/g) || []).length;

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

const backspaceBtn = document.getElementById("backspaceBtn");

backspaceBtn.addEventListener("click", () => {
    display.value = display.value.slice(0, -1);
});

//keyboard keys input
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (!isNaN(key) || key === ".") {
        appendToDisplay(key);
    }

    if (key === "+") appendToDisplay("+");
    if (key === "-") appendToDisplay("−");
    if (key === "*") appendToDisplay("×");
    if (key === "/") appendToDisplay("÷");
    if (key === "%") appendToDisplay("%");

    if (key === "Enter") {
        event.preventDefault(); // stops form reload behavior
        calculate();
    }
 
    if (key === "Backspace") {
        display.value = display.value.slice(0, -1);
    }

    if (key === "Escape") {
        clearDisplay();
    }

    if (key === "(" || key === ")") {
        appendToDisplay(key);
    }
});

//input animation
document.addEventListener("keydown", () => {
    display.classList.add("active");
    setTimeout(() => display.classList.remove("active"), 100);
});
document.addEventListener("keydown", (event) => {

    let key = event.key;

    // Map keyboard keys to button text
    if (key === "*") key = "×";
    if (key === "/") key = "÷";
    if (key === "-") key = "−";
    if (key === "Enter") key = "=";
    if (key === "Backspace") key = "⌫";
    if (key === "Escape") key = "C";
    if (key === "(") key = "()";
    if (key === ")") key = "()";

    const buttons = document.querySelectorAll("button");

    buttons.forEach(btn => {
        if (btn.innerText === key) {
            btn.classList.add("key-press");

            setTimeout(() => {
                btn.classList.remove("key-press");
            }, 120);
        }
    });
});



