let interpreter = createInterpreter({
    title: "NOO! Interpreter",
    theme: "light",
    titlebar: [
        {p: "by VilgotanL (and ZeroPlayerRodent)"},
        {p: "Updated as of 2021-12-20"},
        {a: "NOO! by Zero player rodent", href: "https://esolangs.org/wiki/NOO!"},
    ],
    options: [
        {slow: "checkbox", text: "Slow: ", value: true},
    ],
    buttons: [
        {run: "Run"},
        {textGen: "Text To Code"},
    ],
    code: "code here",
    output: "output here",
    highlight: function(code, append, style) {
        for(let i=0; i<code.length; i++) {
            if("NO".includes(code[i])) style("color: #0055FF;");
            else style();
            append(code[i]);
        }
    }
});

interpreter.onClick("run", async function() {
    await run_eek(interpreter.code);
});
interpreter.onClick("textGen", async function() {
    interpreter.output(text_to_code(interpreter.code));
});


function text_to_code(str) {
    let code = "";
    for(let i=0; i<str.length; i++) {
        let charCode = str.charCodeAt(i);
        console.log(charCode);

        code += "NOOOOOO"
        while(charCode >= 10) {
            code += "NOO";
            charCode -= 10;
        }
        while(charCode > 0) {
            code += "NO";
            charCode--;
        }
        code += "NOOONOOOOOOOOO\n";
    }
    return `${code}NOOOOOOOOOOOOOOOOOOOOO!`;
}


async function run_eek(code) {

    //Parse E, e, and k
    let m = [0]; //instruction array
    let instr_code_map = [null];
    let p = 0; //instruction pointer

    for(let i=0; i<code.length; i++) {
        let char = code[i];
        if(char === "N") {
            p++;
            m.push(0);
            instr_code_map.push({ start: i, end: i+1 });
        } else if(char === "O") {
            m[p]++;
            if(instr_code_map.length > 0) {
                instr_code_map.at(-1).end = i+1;
            }
        }
    }
    p = 0;

    let acc = 0; //accumulator
    let stack = [];
    let stackB = [];

    let inpBuffer = "";

    function assert_not_empty(stack) {
        //if(stack.length === 0) interpreter.err("Stack underflow");
        if(stack.length === 0) stack.push(0);
    }

    while(true) {
        p++;
        let prevP = p;
        

        if(m[p] === 10) {
            assert_not_empty(stack);
            if(stack.at(-1) === acc) p += 2;
        }
        if(m[p] === 11) {
            assert_not_empty(stack);
            if(stack.at(-1) !== acc) p += 2;
        }

        if(m[p] === 0) {
            acc++;
        }
        if(m[p] === 1) { //IMPORTANT: we cant use else if
            assert_not_empty(stack);
            stack[stack.length-1]++;
        }
        if(m[p] === 2) {
            assert_not_empty(stack);
            stack[stack.length-1] += 10;
        }
        if(m[p] === 3) {
            assert_not_empty(stack);
            interpreter.output(String.fromCharCode(stack.at(-1)));
        }
        if(m[p] === 4) {
            assert_not_empty(stack);
            if(inpBuffer.length === 0) {
                inpBuffer = (prompt("Enter line") ?? "")+"\n";
            }
            stack[stack.length-1] = inpBuffer.charCodeAt(0);
            inpBuffer = inpBuffer.slice(1);
        }
        if(m[p] === 5) {
            p -= acc;
        }
        if(m[p] === 6) {
            stack.push(0);
        }
        if(m[p] === 7) {
            let times = Math.floor(Math.random()*acc);
            for(let i=0; i<times; i++) {
                assert_not_empty(stack);
                stack.pop();
            }
        }
        if(m[p] === 8) {
            p += acc;
        }
        if(m[p] === 9) {
            assert_not_empty(stack);
            stack.pop();
        }
        if(m[p] === 12) {
            acc--;
        }
        if(m[p] === 13) {
            acc = 0;
        }
        if(m[p] === 14) {
            assert_not_empty(stack);
            acc = stack.at(-1);
        }
        if(m[p] === 15) {
            stack.push(acc);
        }
        if(m[p] === 16) {
            assert_not_empty(stack);
            interpreter.output(""+stack.at(-1));
        }
        if(m[p] === 17) {
            assert_not_empty(stack);
            stackB.push(stack.at(-1));
        }
        if(m[p] === 18) {
            assert_not_empty(stackB);
            stack.push(stackB.at(-1));
        }
        if(m[p] === 19) {
            assert_not_empty(stackB);
            stackB.pop();
        }
        if(m[p] === 20) {
            assert_not_empty(stack);
            stack[stack.length-1]--;
        }

        interpreter.clearHighlights();
        if(instr_code_map[prevP]) interpreter.highlight(instr_code_map[prevP].start, instr_code_map[prevP].end, "background-color: lawngreen;");

        if(instr_code_map[prevP] && interpreter.option("slow")) await sleep(10);

        if(m[p] === 21) {
            break;
        }
    }
    interpreter.clearHighlights();
}
