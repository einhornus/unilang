vocab = []

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

function readTextFile3(file)
{
    vocab = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                //console.log(lines);

                let prevIndex = 0
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].split(";");
                    index = parseInt(line[3])
                    pos = line[2]
                    word = line[0]
                    def = line[1]

                    if(index != prevIndex) {
                        vocab.push([])
                        prevIndex = index
                    }

                    vocab[vocab.length - 1].push([word, def, pos, index])
                }
            }
        }
    }

    rawFile.send(null);
}

function searchmean(word, count){
    if(vocab.length == 0){
        readTextFile3("vocab2.txt")
    }

    lst = []
    for(let i = 0; i<vocab.length-1; i++){
        power = 0.0
        for(let j = 0; j<vocab[i].length; j++){
            w = vocab[i][j][0]
            def = vocab[i][j][1]
            index = vocab[i][j][3]
            def2 = " "+def

            if(def.indexOf(word) != -1){
                score1 = 1.0 / (1+index);
                score2 = Math.pow(word.length / def.length, 2)
                score3 = 1.0
                if(def2.indexOf(word+" ") || def2.indexOf(" "+ word)){
                    score3*=4.0
                }

                console.log(w, score1, score2, score3)
                power += score1*score2*score3
            }
        }
        if(power>0){
            lst.push([power, vocab[i][0][0]])
        }
    }
    lst.sort((a,b) => b[0]-a[0])

    console.log(lst)

    newlst = []
    for(let i = 0; i<Math.min(lst.length, count); i++){
        newlst.push(lst[i])
    }
    return newlst
}

function dosearchmean(){
    var inputVal = document.getElementById("text").value;
    var p = document.getElementById("p")
    p.innerText = ""

    word = inputVal

    if(fileExists("articles//"+word+".html")){
        cont = readTextFile2("articles//"+word+".html")
        var content1 = document.getElementById("content")
        content1.innerHTML = cont;

        if(!nietpushen) {
            history.push(word)

            if(history.length>1) {
                poses.push(document.documentElement.scrollTop)
            }
        }
    }
    else {
        if (word.length > 0) {
            leven = searchmean(word, 100)
            newval = ""
            for (let i = 0; i < leven.length; i++) {
                newval += leven[i][1] + "\n"
            }

            if (newval.length == 0) {
                newval = "No results found"
            }

            p.innerHTML = handleText(newval);
        }
    }
}

