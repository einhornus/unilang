
let ___debug = false

let articles_hash = {}

function ___api_get_root(port){
    if(___debug){
        return "http://localhost:"+port+"/api/"
    }
    else {
        return "http://174.138.15.163:"+port+"/api/"
    }
}

function ___api_get_article_(word)
{
    if(articles_hash[word] != undefined){
        console.log("From hash ", word)
        return articles_hash[word]
    }

    res = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(8080)+"article?lang="+__real_lang+"&word="+word, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                res = allText
                articles_hash[word] = allText
                console.log("Hashed ", word)
                return res
            }
        }
    }
    rawFile.send(null);
    return res
}



function ___api_get_listen(level, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ___api_get_root(8080)+"sound/lis?level="+level+"&lang="+__real_lang, true);


    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                console.log("Listened", allText)
                callback(allText)
            }
        }
    }

    rawFile.send(null);
    return;

}
