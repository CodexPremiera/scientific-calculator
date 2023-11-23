/* ==================== QUERY SELECTION ==================== */

const input_box = document.getElementById('input_box');

const keysList = [];
function listKeyValue(button) {
    const id = button.id;
    const value = button.textContent;
    keysList.push({ id, value });
}
document.querySelectorAll('.calculator_key').forEach(listKeyValue);


/* ==================== INPUT OPERATION ==================== */

// CALCULATOR KEYS
function handleKeypad(key) {
    const element = document.getElementById(key.id);
    element.onclick = () => {
        switch (key.value) {
            case '⌫':
                clearInput();
                break;
            case 'AC':
                deleteInput();
                break;
            case '=':
                calculate();
                break;

            case 'xn':
                appendToInput('^(');
                break;

            case 'x2':  case 'x3':  case 'x-1':
                const exponentPattern = /x(-?\d+)/g;
                const replaceExponent = (match, exponent) => `^(${exponent})`;
                appendToInput(key.value.replace(exponentPattern, replaceExponent));
                break;

            case '√':   case '∛':
            case 'sin': case 'tan': case 'cos':
            case 'log': case 'ln':
                appendToInput(key.value + '(');
                break;
            default:
                appendToInput(key.value);
                break;
        }
    };
}
keysList.forEach(handleKeypad);

// KEYBOARD KEYS
const focusOnInputBox = (event) => {
    if (document.activeElement === input_box)
        return;

    input_box.focus();
    if (event.key !== 'Backspace')
        input_box.selectionStart = input_box.selectionEnd = input_box.value.length;
};
document.addEventListener('keydown', focusOnInputBox);

const handleKeyboard = event => {
    if (event.key === 'Enter') calculate();
    if (event.key === 'Delete') clearInput();
};
input_box.addEventListener('keyup', handleKeyboard);

// INPUT OPERATIONS
const appendToInput = value =>
    input_box.value += value;

const clearInput = () => {
    const currentValue = input_box.value;
    input_box.value = currentValue.substring(0, currentValue.length - 1);
};

const deleteInput = () =>
    input_box.value = '';


/* ==================== CALCULATION ==================== */

function formatExpression(inputExpression) {
    // Square Root
    const sqrtPattern = /√(\d+|\([^)]+\))/g;
    const replaceSqrt = (match, content) => `sqrt(${content})`;

    // Cube Root
    const cbrtPattern = /∛(\d+|\([^)]+\))/g;
    const replaceCbrt = (match, content) => `cbrt(${content})`;

    // Trigonometric Function
    const trigPattern = /(sin|cos|tan)\((-?\d+(\.\d+)?)\)/g;  // regex for sin(x)
    const replaceTrig = (match, p1, p2) => {
        const angleValue = parseFloat(p2);
        return `${p1}(${angleValue}deg)`;
    }

    // Logarithmic Functions
    const lnPattern = /ln\(([^)]+)\)/g;
    const logPattern = /log\(([^,]+)\)/g;
    const logXPattern = /log(\d+)\(([^)]+)\)/g;

    return inputExpression
        .replace(/π/g, 'pi')
        .replace(/φ/g, 'phi')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(sqrtPattern, replaceSqrt)
        .replace(cbrtPattern, replaceCbrt)
        .replace(trigPattern, replaceTrig)
        .replace(lnPattern, 'log($1)')
        .replace(logPattern, 'log($1, 10)')
        .replace(logXPattern, 'log($2, $1)');
}

function calculate() {
    let expression = formatExpression(input_box.value);

    try {
        input_box.value = math.evaluate(expression);
    } catch (error) {
        input_box.value = 'Syntax Error';
    }
}
