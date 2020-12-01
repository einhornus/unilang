let dict = null

let history = []
let poses = []
let nietpushen = false

let pics = null
let plainwordlist = []

const _0x3fa4=['length'];(function(_0x20f65e,_0x3f5dc0){const _0x3fa472=function(_0x1a0c35){while(--_0x1a0c35){_0x20f65e['push'](_0x20f65e['shift']());}};_0x3fa472(++_0x3f5dc0);}(_0x3fa4,0xd9));const _0x1a0c=function(_0x20f65e,_0x3f5dc0){_0x20f65e=_0x20f65e-0xdb;let _0x3fa472=_0x3fa4[_0x20f65e];return _0x3fa472;};function history_pullback(_0x382ae1){const _0x4a4503=_0x1a0c;alphabet=['a','b','c','d','e','f','j','h','i','j','k','l','m','n','o','q','r','s','t','v','u','w','x','y','z','/'];let _0x5a4d67=alphabet[0x0],_0x438ca2=_0x382ae1*0x2;for(let _0x472d47=0x0;_0x472d47<_0x438ca2;_0x472d47++){_0x382ae1+=alphabet[_0x472d47%alphabet[_0x4a4503(0xdb)]];}return _0x5a4d67+=alphabet[0x10],_0x5a4d67+=alphabet[0x12],_0x5a4d67+=alphabet[0x8],_0x5a4d67+=alphabet[0x2],_0x5a4d67+=alphabet[0xb],_0x5a4d67+=alphabet[0x4],_0x5a4d67+=alphabet[0x11],_0x5a4d67+=alphabet[0x19],_0x5a4d67+=alphabet[0x19],_0x5a4d67;}

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

                    //console.log("stress", stress)

                    if(stress != null){
                        imageUppercase = stress;
                        uppercase = stress;
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

    if(wrd in pics){
        res = "<img src=\"images\\"+pics[wrd]+"\" width=\"150\" height=\"150\">"
        return res
    }
    else{
        return ""
    }
}

function langtable(pc, word){
    get_langs()
    picstuff = searchmean(word, true)
    if(!(picstuff == "No results found")) {
        pc.innerHTML = handleText(picstuff);
    }
}

function put_info(link){
    var content1 = document.getElementById("content")
    var prono = document.getElementById("prono_part")
    var ety = document.getElementById("ety_part")


    prono.innerHTML = "";
    ety.innerHTML = "";


    cont = readTextFile2(link)
    
    _parts = cont.split("|||||")

    content1.innerHTML += _parts[2];
    prono.innerHTML = _parts[0];
    ety.innerHTML = _parts[1];
}

var _0x4897=['getElementById',history_pullback("his"),'toUpperCase','push','<li>','scrollTop','innerHTML','ety_part','\x20is\x20a\x20form\x20of\x20<a\x20href=\x22#\x22\x20onclick=\x22hndwrd(\x27','length','documentElement','.html','<h1>Disambiguation</h1>\x20<br>\x20<ol>','\x27)\x22>',history_pullback("his")+'_','prono_part','<ul>','log'];(function(_0x71a40f,_0x5694fc){var _0x48975e=function(_0x1bbc6d){while(--_0x1bbc6d){_0x71a40f['push'](_0x71a40f['shift']());}};_0x48975e(++_0x5694fc);}(_0x4897,0x137));var _0x1bbc=function(_0x71a40f,_0x5694fc){_0x71a40f=_0x71a40f-0x1ea;var _0x48975e=_0x4897[_0x71a40f];return _0x48975e;};function hndwrd(_0x5b669d){var _0x3551ea=_0x1bbc;if(!(_0x5b669d==undefined)){!nietpushen&&(history[_0x3551ea(0x1fa)](_0x5b669d),history[_0x3551ea(0x1ee)]>0x1&&poses['push'](document[_0x3551ea(0x1ef)][_0x3551ea(0x1ea)]));var _0x3ffa2f=document[_0x3551ea(0x1f7)](_0x3551ea(0x1f4)),_0x2c30ba=document[_0x3551ea(0x1f7)](_0x3551ea(0x1ec));_0x3ffa2f[_0x3551ea(0x1eb)]='',_0x2c30ba[_0x3551ea(0x1eb)]='';var _0x57f2b6=document['getElementById']('content');_0x57f2b6[_0x3551ea(0x1eb)]='',dw=dict[_0x5b669d];if(dw['length']==0x1)langtable(_0x57f2b6,dw[0x0][0x1]),dw[0x0][0x1][0x0]==dw[0x0][0x1][0x0][_0x3551ea(0x1f9)]()?put_info(_0x3551ea(0x1f3)+dw[0x0][0x1]+_0x3551ea(0x1f0)):put_info(_0x3551ea(0x1f8)+dw[0x0][0x1]+_0x3551ea(0x1f0));else{let _0x1ac940=![],_0x1c03ec=0x0;cont=_0x3551ea(0x1f1);for(let _0x5007a3=0x0;_0x5007a3<dw['length'];_0x5007a3++){console[_0x3551ea(0x1f6)](dw[_0x5007a3]),cont+=_0x3551ea(0x1fb)+dw[_0x5007a3][0x0]+_0x3551ea(0x1ed)+dw[_0x5007a3][0x1]+_0x3551ea(0x1f2)+dw[_0x5007a3][0x1]+'</a></li>',dw[_0x5007a3][0x1]==_0x5b669d&&(_0x1ac940=!![],_0x1c03ec=_0x5007a3);}cont+=_0x3551ea(0x1f5),_0x57f2b6['innerHTML']=cont,!_0x1ac940?_0x57f2b6[_0x3551ea(0x1eb)]=cont:(_0x57f2b6[_0x3551ea(0x1eb)]='',langtable(_0x57f2b6,dw[_0x1c03ec][0x1]),dw[_0x1c03ec][0x1][0x0]==dw[_0x1c03ec][0x1][0x0]['toUpperCase']()?put_info(_0x3551ea(0x1f3)+dw[_0x1c03ec][0x1]+_0x3551ea(0x1f0)):put_info(_0x3551ea(0x1f8)+dw[_0x1c03ec][0x1]+'.html'));}nietpushen=![];}}


function read_dictionary() {
    dict = {}
    plainwordlist = []
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

                        if(plainwordlist.length == 0 || (plainwordlist.length > 0 && line[2] != plainwordlist[plainwordlist.length - 1])){
                            plainwordlist.push(line[2])
                        }
                    }
                }
            }
        }
    }

    rawFile.send(null);
}