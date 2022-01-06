function randomInt(max) {
    return Math.floor(Math.random() * max);
}

var letter2color = function(letter) {
    return('rgb(');
}

var expandRegex = function(regex) {
    // gstack stores groups for maybe eventual backreference
    var gstack = [];
    // opstack stores open symbols that need to be closed
    var opstack = [];
    // tstack stores the actual text, should optimally collapse to one element
    var tstack = [];
    var index = 0;
    // cchar is current character 
    var cchar = regex[index];

    while (index <= regex.length) {
	if (['[', '{', '('].includes(cchar)) {
	    console.log("CCHAR IN LIST", cchar);
	    opstack.push(cchar);
	    tstack.push('')
	} else if (cchar == '}') {
	    console.log("CCHAR CLOSING }", history);
	    var repeats = tstack.pop().split(',');
	    var torepeat = tstack.pop()
	    if (gstack.length == 0) {
		var repeated = torepeat.slice(-1);
	    } else var repeated = torepeat;
	    if (repeats.length > 1) {
		repeats = randomInt(parseInt(repeats[1]) - parseInt(repeats[0])) +
		    randomInt(parseInt(repeats[1])); 
		tstack.push(torepeat + repeated.repeat(repeats-1));
	    } else {
		tstack.push(torepeat + repeated.repeat(parseInt(repeats-1)));
	    }
	    if (opstack.pop() != '{') console.log("expected '{'");
	} else if (cchar == '*' || cchar == '+') {
	    var repeats = cchar == '+' ? randomInt(100) : randomInt(100) + 1;
	    var torepeat = tstack.pop()
	    if (gstack.length == 0) {
		var repeated = torepeat.slice(-1);
	    } else var repeated = torepeat;
	    tstack.push(torepeat + repeated.repeat(parseInt(repeats-1)));
	} else if (cchar == ')') {
	    console.log("CCHAR CLOSING )");
	    if (opstack.pop() != '(') console.log("expected '('");
	    gstack.push(tstack[tstack.length-1]);
	} else if ( cchar == ']') {
	    console.log("CCHAR CLOSING ]");
	    if (opstack.pop() != '[') console.log("expected '['");
	    var charset = tstack.pop();
	    tstack.push(charset[randomInt(charset.length)]);
	} else if ( cchar == '.' ) {
	    console.log("CCHAR IS .");
	    tstack[tstack.length-1] += randomInt(10);
	} else if ( cchar != undefined ) {
	    console.log(cchar)
	    if (tstack.length == 0) tstack.push('');
	    tstack[tstack.length-1] += cchar;
	}
	console.log(tstack);
	index+=1;
	cchar = regex[index];
    }
    // really there should only be one element in tstack, but code no work good 
    return tstack.join('');
} 

var imgFromRegex = function(ctx, canvasSize, regex) {

    const imgData = ctx.createImageData(canvasSize[0], canvasSize[1]);
    const data = imgData.data;
    var expanded = expandRegex(regex);
    for (var i = 0; i < expanded.length; i++) {
	if ( i * 4 < data.length ) {
	    var pix = parseInt(expanded[i]) * 28;
	    data[i*4] = pix;
	    data[i*4 + 1] = 255 - pix;
	    data[i*4 + 2] = pix / 2;
	    data[i*4 + 3] = 255;
	}
    }
    return(imgData);
}

var canvas = document.getElementById('img');
const ctx = canvas.getContext('2d');
var genBtn = document.getElementById("gen");
genBtn.onclick = e => {
    var regex  = document.getElementById('imgex').value;
    var dat = imgFromRegex(ctx, [canvas.width, canvas.height], regex);
    ctx.putImageData(dat, 0, 0);
};

