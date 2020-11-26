let vocabs = null;


function dosearch(index) {
    word = document.getElementById("searchfield").value
    if (word[0] == word[0].toUpperCase()) {
        word = "_" + word;
    }

    stuff = ""
    //if (fileExists("articles//" + word + ".html")) {
    //    stuff = word
    //} else {
    if (index == 1) {
        stuff = dosearchmean(word);
    } else {
        stuff = dosearchsim(word)
    }
    //}

    if (stuff != "No results found") {
        stuff = "Search results\n" + stuff;
    }

    console.log("Stuff = ", stuff)
    putText(stuff)
}


function fileExists(url) {
    if (url) {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status == 200;
    } else {
        return false;
    }
}

function readTextFile3(file) {
    vocab = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] != undefined) {
                        let line = lines[i].split("|");
                        if (line.length == 5) {
                            index = parseInt(line[4])
                            pos = line[3]
                            words1 = line[0].split(', ')
                            words2 = line[2].split(', ')

                            def = line[1]

                            vocab.push([words1, def, words2, pos, index])
                        }
                    }
                }
            }
        }
    }

    rawFile.send(null);
    return vocab
}


function searchlevenstein(word, maxcnt) {
    if (searchvocab.length == 0) {
        readTextFile5("searchlist.txt")
    }

    res = []
    cnt = 0
    for (let qq = 0; qq < searchvocab.length; qq++) {
        key = searchvocab[qq]
        if (key.length >= 1) {
            dst = levenshteinDistance2(key, word)
            dst /= key.length
            //console.log(dst, key)

            //if(dst == 0){
            //    return [[0, key]]
            //}

            if (res.length < maxcnt) {
                //console.log("1", dst, key, word, res.length)
                res.push([dst, key])
            } else {
                //console.log("2", dst, key, word, res.length)
                res.sort(function (a, b) {
                    return a[0] - b[0]
                });
                if (dst < res[maxcnt - 1][0]) {
                    res[maxcnt - 1] = [dst, key]
                }
            }
            cnt += 1
        }
        if (cnt > 10000) {
            //return res
        }
    }

    console.log("Search Lev = ", res)
    return res
}


function dosearchsim(word) {
    if (word.length > 0) {
        leven = searchlevenstein(word, 10)
        console.log("Leven ", leven)

        newval = "<ul>"
        for (let i = 0; i < leven.length; i++) {
            newval += "<li>" + leven[i][1] + "</li>"
        }
        newval += "</ul>"

        if (leven.length == 0) {
            newval = "No results found"
        }
    }

    return newval
}

function get_additional_langs() {
    let protolangs = [
        "nl",
        "fr",
        "ru",
        "es",
        "it",
        "de",
        "pt",
        "sv"
    ]

    if (navigator.languages != undefined) {
        let res = ["en"];
        for (let j = 0; j < protolangs.length; j++) {
            for (let i = 0; i < navigator.languages.length; i++) {
                let lng = navigator.languages[i];
                if (lng.indexOf(protolangs[j]) != -1) {
                    res.push(protolangs[j]);
                    break
                }
            }
        }
        return res
    } else
        return []
}

function make_table(word, langs_from, lang_to) {
    word = word.replace("ё", "е")
    word = word.replace("ё", "е")
    word = word.toLowerCase()



    if(word[0] == "_"){
        word = word[1].toUpperCase()+word.substr(2)
    }

    let english_defs = new Set()
    let national_defs = new Set()

    all_the_langs = []
    for (let q = 0; q < langs_from.length; q++) {
        all_the_langs.push(langs_from[q])
    }
    all_the_langs.push(lang_to)

    if (vocabs == null) {
        vocabs = []
        for (let q = 0; q < all_the_langs.length; q++) {
            let current_lang = all_the_langs[q]

            vocab = readTextFile3("dictionaries//" + current_lang + "2" + lang_to)
            vocabs.push(vocab)
        }
    }

    for (let q = 0; q < all_the_langs.length; q++) {
        vocab = vocabs[q]

        for (let i = 0; i < vocab.length - 1; i++) {
            let w = vocab[i][0]

            let def = vocab[i][1]
            let tran = vocab[i][2]


            if((tran[0][0] >= 'а' && tran[0][0] <= 'я') || (tran[0][0] >= 'А' && tran[0][0] <= 'Я')) {
                for (let k = 0; k < tran.length; k++) {
                    tran[k] = tran[k].replace("ё", "е");
                    tran[k] = tran[k].replaceAll("́", "")
                }
            }

            pos = vocab[i][3]
            index = vocab[i][4]

            if (w.includes(word) || def.indexOf(word + "; ") == 0 || tran.includes(word)) {
                english_defs.add(def);
                //national_defs.add([q, def, w, tran, pos])
                //lst.push([w, def, tran, current_lang])
            }
        }
    }


    for (let q = 0; q < all_the_langs.length; q++) {
        vocab = vocabs[q]

        for (let i = 0; i < vocab.length - 1; i++) {
            let w = vocab[i][0]

            let def = vocab[i][1]
            let tran = vocab[i][2]


            pos = vocab[i][3]
            index = vocab[i][4]

            if(english_defs.has(def)){
                national_defs.add([q, def, w, tran, pos])
            }
        }
    }



    if (english_defs.size == 0) {
        return null
    }


    let inds = new Set()
    let v = 0
    english_defs.forEach(function (value) {
        inds[value] = v
        v++;
    })


    let table = new Array(langs_from.length + 1);
    for (var i = 0; i < table.length; i++) {
        table[i] = new Array(english_defs.size);

        for (var j = 0; j < english_defs.size; j++) {
            table[i][j] = "-";
        }
    }

    national_defs.forEach(function (value) {
        lang_index = value[0]
        index = inds[value[1]]
        let put = value[2].join(", ")

        v = value[1]
        v = "<b>" + v
        v = v.replace(";", "</b>, " + value[4].toLowerCase() + " &#8212 <br>")
        table[0][index] = v

        if (lang_index != 0) {
            table[lang_index][index] = put
        }

        table[langs_from.length][index] = value[3].join(", ")
    })

    return table
}


function searchmean(word, langs, target, simple) {
    let langs_with_en = []
    for (let i = 0; i < langs.length; i++) {
        if (langs[i] != target) {
            langs_with_en.push(langs[i])
        }
    }
    table = make_table(word, langs_with_en, target)

    if (table == null) {
        return "No results found";
    }

    let lim = 3
    let detailed = table[0].length > lim

    let full = "<table class='searchtable'>"
    if(!detailed || !simple) {
        full += "<tr>"
    }

    let short = "<table class='searchtable'>"
    short += "<tr>"

    widths = []
    widths[0] = Math.max(30, 50 - (langs_with_en.length - 1) * 10)
    for (let i = 1; i < langs_with_en.length+1; i++) {
        widths[i] = Math.round((100 - widths[0]) / (langs_with_en.length))
    }

    for (let i = 0; i < langs_with_en.length; i++) {
        if(!detailed || !simple) {
            full += "<td style='text-align: center; width:" + widths[i] + "%'>" + get_flag(langs_with_en[i]) + "</td>"
        }
        short += "<td style='text-align: center;width:"+widths[i]+"%''>" + get_flag(langs_with_en[i]) + "</td>"
    }

    if(!detailed || !simple) {
        full += "<td style='text-align: center; width:" + widths[langs_with_en.length] + "%''>" + get_flag(target) + "</td>"
        full += "</tr>"
    }

    short += "<td style='text-align: center; width:"+widths[langs_with_en.length]+"%''>" + get_flag(target) + "</td>"
    short += "</tr>"


    for (let i = 0; i < table[0].length; i++) {
        if(i < lim){
            short += "<tr>"
            for (let j = 0; j < table.length; j++) {
                if(simple) {
                    table[j][i] = table[j][i].replace("<br>", "");
                }
                short += "<td>" + table[j][i] + "</td>"
            }
            short += "</tr>"
        }
        if(i >= lim || !detailed){
            full += "<tr>"
            for (let j = 0; j < table.length; j++) {
                if(simple) {
                    table[j][i] = table[j][i].replace("<br>", "");
                }
                full += "<td style='width:" + widths[j] + "%'>" + table[j][i] + "</td>"
            }
            full += "</tr>"
        }
    }

    short += "</table>"
    full += "</table>"


    let html = ""

    if(detailed && simple){
        html+="<details>\n"

        html+="<summary>\n"
        html+=short
        html+="</summary>\n"

        html+=full
        html+="</details>\n"
    }
    else{
        html+=full
    }

    return html
}

function get_flag(lang) {
    return "<img src=\"images/flags/" + lang + ".svg\" style=\"width:42px;height:42px;\">"
}

function do_ruby(text, lang) {
    return "<ruby>" + text + "<rt>" + get_flag(lang) + "</rt></ruby>"
}

function dosearchmean(word) {
    if (word.length > 0) {
        res = searchmean(word, get_additional_langs(), "ru", false)
        return res
    }

    return newval
}

