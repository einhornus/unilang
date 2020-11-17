let dict = null

let history = []
let poses = []
let nietpushen = false

let pics = null

function handleback() {
    if (history.length <= 1) {

    } else {
        history.pop()
        nietpushen = true
        hndwrd(history[history.length - 1])
        document.documentElement.scrollTop = poses[history.length - 1]
    }

    if (poses <= 1) {

    } else {
        document.documentElement.scrollTop = poses[poses.length - 1]
        console.log("active", poses)
        poses.pop()
    }
}


function readTextFile2(file)
{
    res = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
            }
        }
    }
    rawFile.send(null);
    return res
}


document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    } else if (e.keyCode == '40') {
        // down arrow
    } else if (e.keyCode == '37') {
        handleback()
    } else if (e.keyCode == '39') {
        // right arrow
    }
}


read_dictionary()
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const input = urlParams.get('input')

if (input != undefined) {
    document.getElementById("text").value = input
    f();
}

function rus(a) {
    punctuation = [
        '<',
        '>',
        '!',
        ',',
        ' ',
        '?',
        ';',
        ':',
        '"',
        '&',
        '*',
        '\'',
        '.',
        '%',
        '[',
        ']',
        '(',
        ')',
        '{',
        '}',
        '\n',
        '\r',
        '…',
        '«',
        '»',
        '=',
        '’',
        '‘',
        '/',
        '-',
        '“',
        '”',
        ' ',
        '–',
        String.fromCharCode(160)
    ]

    if (punctuation.includes(a)) {
        return false
    } else {
        return true
    }
    return false
}

function upperfy(w, u) {
    if (u) {
        return w[0].toUpperCase() + w.substr(1, w.length - 1)
    } else {
        return w
    }
}


function lowerfy(w, u) {
    if (u) {
        return w[0].toLowerCase() + w.substr(1, w.length - 1)
    } else {
        return w
    }
}


function f() {
    var inputVal = document.getElementById("text").value;
    var p = document.getElementById("p")
    putText(inputVal)
    p.innerHTML = handleText(inputVal);
    //sc.hidden = true
}


function handleText(text) {

    res = ""
    words = []
    last = ""

    for (let i = 0; i < text.length; i++) {

        if (rus(text[i])) {
            last += text[i]
        } else {
            words.push(last)
            if (text[i] == "\n" || text[i] == "\r") {
                words.push("<br>")
            } else {
                words.push(text[i])
            }
            last = ""
        }

    }
    words.push(last);


    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
            //res += words[i]

            word = words[i]

            if(word.length > 0) {
                let stress = null;

                if(word.indexOf("́")!=-1){
                    stress = word
                    word = word.replaceAll("́", "")
                }

                let isUpper = word[0].toUpperCase() == word[0]
                let lowercase = lowerfy(word, true)
                let uppercase = upperfy(lowercase, isUpper)

                let images = []
                let defImage = ""
                let remainCased = false

                if (lowercase in dict) {
                    for (let j = 0; j < dict[lowercase].length; j++) {
                        if(!images.includes(dict[lowercase][j][0])){
                            images.push(dict[lowercase][j][0]);
                            defImage = dict[lowercase][j][0];
                        }
                    }
                }

                if (uppercase in dict) {
                    for (let j = 0; j < dict[uppercase].length; j++) {
                        if(!images.includes(dict[uppercase][j][0])){
                            images.push(dict[uppercase][j][0])
                            defImage = dict[uppercase][j][0]
                            if(!remainCased){
                                remainCased = true;
                            }
                        }
                    }
                }


                if(images.length == 0){
                    res += words[i];
                }
                else{
                    let imageUppercase = upperfy(defImage, isUpper);

                    console.log("Images", images)

                    if(stress != null){
                        imageUppercase = stress;
                    }

                    if(images.length > 1){
                        if(remainCased){
                            res += "<a href=#  onclick=hndwrd(\'" + uppercase + "\');>" + uppercase + "</a>"
                        }
                        else{
                            res += "<a href=#  onclick=hndwrd(\'" + lowercase + "\');>" + uppercase + "</a>"
                        }
                    }
                    else{
                        if(remainCased){
                            res += "<a href=#  onclick=hndwrd(\'" + uppercase + "\');>" + imageUppercase + "</a>"
                        }
                        else{
                            res += "<a href=#  onclick=hndwrd(\'" + lowercase + "\');>" + imageUppercase + "</a>"
                        }
                    }
                }
            }

            /*
            let isUpper = words[i][0].toUpperCase() == words[i][0]
            let w2 = "_"+words[i]

            console.log(w2, dict[w2])
            if (dict[w2] != undefined) {
                res += "<a href=#  onclick=hndwrd(\'" + dict[w2][1] + "\');>" + upperfy(dict[w2][0], isUpper) + "</a>"
            } else {
                let w = words[i].toLowerCase()

                if (dict[w] == undefined) {
                    res += upperfy(words[i], isUpper)
                } else {
                    res += "<a href=#  onclick=hndwrd(\'" + dict[w][1] + "\');>" + upperfy(dict[w][0], isUpper) + "</a>"
                }
                res += ""
            }
             */
        }
    }

    return res
}

function putText(text){
    handled = handleText(text)
    var p = document.getElementById("p")
    p.innerHTML = handled;

    /*
    if (!nietpushen) {
        history.push(handled)

        if (history.length > 1) {
            poses.push(document.documentElement.scrollTop)
        }
    }

    nietpushen = false
     */
}

function getPic(wrd){
    if(pics == null) {
        all = readTextFile2("pics.txt")
        lines = all.split('\n')
        pics = {}

        for(let i = 0; i<lines.length; i++){
            split = lines[i].split(' ')
            if(split.length == 2){
                pics[split[0]] = split[1]
            }
        }
    }

    console.log(pics)
    if(wrd in pics){
        res = "<img src=\"images\\"+pics[wrd]+"\" width=\"150\" height=\"150\">"
        return res
    }
    else{
        return ""
    }
}

function hndwrd(wrd) {
    if(!(wrd == undefined)) {
        if (!nietpushen) {
            history.push(wrd)

            if (history.length > 1) {
                poses.push(document.documentElement.scrollTop)
            }
        }

        var content1 = document.getElementById("content")
        var pc = document.getElementById("pic")

        dw = dict[wrd]

        console.log("DW", dw)

        if (dw.length == 1) {
            if (dw[0][1][0] == dw[0][1][0].toUpperCase()) {
                cont = readTextFile2("articles//_" + dw[0][1] + ".html")
            } else {
                cont = readTextFile2("articles//" + dw[0][1] + ".html")
            }
            pc.innerHTML = getPic(wrd)
            content1.innerHTML = cont;
        } else {
            let stop = false
            let st = 0
            cont = "<h1>Disambiguation</h1> <br> <ol>"
            for (let j = 0; j < dw.length; j++) {
                console.log(dw[j])
                cont += "<li>" + dw[j][0] + " is a form of <a href=\"#\" onclick=\"hndwrd('" + dw[j][1] + "')\">" + dw[j][1] + "</a></li>"
                if (dw[j][1] == wrd){
                    stop = true
                    st = j
                }
            }
            cont += "<ul>"
            content1.innerHTML = cont;

            if (!stop) {
                content1.innerHTML = cont;
            }
            else{
                if (dw[st][1][0] == dw[st][1][0].toUpperCase()) {
                    cont = readTextFile2("articles//_" + dw[st][1] + ".html")
                } else {
                    cont = readTextFile2("articles//" + dw[st][1] + ".html")
                }
                pc.innerHTML = getPic(wrd)
                content1.innerHTML = cont;
            }

        }

        nietpushen = false
    }
}

function read_dictionary() {
    dict = {}
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "dictionary_simple.txt", false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                //console.log(lines);

                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].split(";");
                    if (line.length == 3) {

                        //line[0] = line[0].replaceAll("́ё", 'ё')
                        //line[1] = line[1].replaceAll("́ё", 'ё')

                        if(dict[line[0]] == undefined){
                            dict[line[0]] = []
                        }

                        dict[line[0]].push([line[1], line[2]])

                    }
                }
            }
        }
    }

    rawFile.send(null);
}