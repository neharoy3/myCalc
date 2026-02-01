let sessionId = localStorage.getItem("calc_session");
if(!sessionId){ //generate a unique id if not there
    sessionId=crypto.randomUUID();
    localStorage.setItem("calc_session",sessionId);
}

//click sound effect!
const clicksound = new Audio("./media/click.mp3");
clicksound.volume=0.4;

const historyToggle = document.getElementById("historyToggle");
const historyPanel = document.getElementById("historyPanel");
historyToggle.addEventListener("click", () => {
    historyPanel.classList.toggle("active");
});

const display = document.getElementById("display");
//create history storage
let historyData = JSON.parse(localStorage.getItem("calcHistory")) || [];
function saveHistory(expression, result){

    historyData.unshift({
        exp: expression,
        res: result
    });

    // keep only last 20 entries
    if(historyData.length > 20){
        historyData.pop();
    }

    localStorage.setItem("calcHistory", JSON.stringify(historyData));

    // send to backend (cloud sync)
    fetch(`https://mycalc-backend.onrender.com/history/${sessionId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            expression: expression,
            result: result
        })
    }).catch(err => console.log("Cloud save failed:", err));

    renderHistory();
}

function renderHistory(){

    historyList.innerHTML = "";

    historyData.forEach(item => {

        const li = document.createElement("li");
        li.textContent = `${item.exp} = ${item.res}`;

        li.addEventListener("click", () => {
            display.value = item.res;
        });

        historyList.appendChild(li);

    });
}

//clear history
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
clearHistoryBtn.addEventListener("click", () => {

    if(historyData.length === 0) return;

    const confirmClear = confirm("Clear all history?");

    if(confirmClear){
        historyPanel.classList.add("clear-anim");

        setTimeout(() => {
            historyData = [];
            localStorage.removeItem("calcHistory");
            renderHistory();
            historyPanel.classList.remove("clear-anim");
        }, 200);

    }

});

function appendToDisplay(input){
    clicksound.currentTime=0;
    clicksound.play();

    const value  = display.value;
    const lastChar = value.slice(-1);
    const operators = "+−×÷";

    //prevent starting w/ operator
    if(operators.includes(input) && value===""){
        if(input!=="−") return;
    }

    //block extra operators
    if(operators.includes(input) && operators.includes(lastChar)){
        return;
    }

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

function clearDisplay(playsound=true){
    if(playsound){
        clicksound.currentTime=0;
        clicksound.play();
    }
    
    display.value = "";
}

function calculate(){
    clicksound.currentTime=0;
    clicksound.play();
    try{
        let expression = display.value;

        expression = expression.replace(/×/g, "*");
        expression = expression.replace(/÷/g, "/");
        expression = expression.replace(/−/g, "-");
        //% is percentage 
        expression = expression.replace(/(\d+\.?\d*)%/g, "($1/100)");

        let result = eval(expression);

        //only 4 decimal places
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(4));
        }

        display.value = result;
        saveHistory(expression,result);
    }
    catch{
        display.value = "INVALID FORMAT";
        //shake animation
        display.classList.add("shake");
        //remove after animation
        setTimeout(()=>{
            display.classList.remove("shake");
        },400);

        //silent clear
        setTimeout(() => {
            clearDisplay(false);
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
    clicksound.currentTime=0;
    clicksound.play();
    display.value = display.value.slice(0, -1);
});

//keyboard keys input
document.addEventListener("keydown", (event) => {
    clicksound.currentTime=0;
    clicksound.play();
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

//theme toggle
const themeBtn = document.getElementById("themeToggle");
const themeIcon = themeBtn.querySelector("img");
// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeIcon.src = "./media/sun.png";
}

// Toggle theme
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeIcon.src = "./media/sun.png";
    } else {
        localStorage.setItem("theme", "dark");
        themeIcon.src = "./media/moon.png";
    }
});

//history panel should close automatically
document.addEventListener("click", (event) => {

    //ignore if panel is not open
    if (!historyPanel.classList.contains("active")) return;

    //ignore if click inside history panel
    if (
        historyPanel.contains(event.target) ||
        historyToggle.contains(event.target)
    ) {
        return;
    }

    //close panel
    historyPanel.classList.remove("active");
});

function loadCloudHistory(){

    fetch(`https://mycalc-backend.onrender.com/history/${sessionId}`)
    .then(res => res.json())
    .then(data => {

        if(data.length > 0){
            historyData = data.map(item => ({
                exp: item.expression,
                res: item.result
            }));

            renderHistory();
        }

    })
    .catch(err => console.log("Cloud load failed:", err));
}


renderHistory();
loadCloudHistory();
