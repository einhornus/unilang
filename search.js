vocab = []

function dosearch(index) {
    word = document.getElementById("searchfield").value
    if (word[0] == word[0].toUpperCase()) {
        word = "_" + word;
    }

    stuff = ""
    //if (fileExists("articles//" + word + ".html")) {
    //    stuff = word
    //} else {
        if(index == 1){
            stuff = dosearchmean(word);
        }
        else{
            stuff = dosearchsim(word)
        }
    //}

    if(stuff != "No results found"){
        stuff = "Search results:\n"+stuff;
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
                    let line = lines[i].split("|");

                    index = parseInt(line[4])
                    pos = line[3]
                    words1 = line[0].split(',')
                    words2 = line[2].split(',')
                    def = line[1]

                    vocab.push([words1, def, words2, pos, index])
                }
            }
        }
    }

    rawFile.send(null);
}



function searchlevenstein(word, maxcnt){
    if(searchvocab.length == 0){
        readTextFile5("searchlist.txt")
    }

    res = []
    cnt = 0
    for (let qq = 0; qq<searchvocab.length; qq++) {
        key = searchvocab[qq]
        if(key.length >= 1) {
            dst = levenshteinDistance2(key, word)
            dst /= key.length
            //console.log(dst, key)

            //if(dst == 0){
            //    return [[0, key]]
            //}

            if(res.length < maxcnt) {
                //console.log("1", dst, key, word, res.length)
                res.push([dst, key])
            }
            else{
                //console.log("2", dst, key, word, res.length)
                res.sort(function(a, b){return a[0]-b[0]});
                if(dst < res[maxcnt - 1][0]){
                    res[maxcnt - 1] = [dst, key]
                }
            }
            cnt+=1
        }
        if (cnt > 10000){
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
            newval += "<li>"+leven[i][1] + "</li>"
        }
        newval += "</ul>"

        if (leven.length == 0) {
            newval = "No results found"
        }
    }

    return newval
}

function searchmean(word, count) {
    if (vocab.length == 0) {
        readTextFile3("dictionaries//en2ru")
    }

    console.log("Vocab")
    console.log(vocab)

    lst = []
    for (let i = 0; i < vocab.length - 1; i++) {
        w = vocab[i][0]
        def = vocab[i][1]
        tran = vocab[i][2]
        index = vocab[i][3]

        if(w.includes(word)){
            lst.push([w, def, tran])
        }
    }

    newlst = []
    for (let i = 0; i < Math.min(lst.length, count); i++) {
        newlst.push(lst[i])
    }
    return newlst
}

function dosearchmean(word) {
    if (word.length > 0) {
        leven = searchmean(word, 50)
        newval = "<ul>"
        for (let i = 0; i < leven.length; i++) {
            newval += "<li>"+leven[i][0] + " ("+leven[i][1]+") -> " + leven[i][2]+"</li>"
        }
        newval+="</ul>";
        if (leven.length == 0) {
            newval = "No results found"
        }
    }

    return newval
}

