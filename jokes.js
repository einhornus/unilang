

let jokes = []
let tm = null
let menu = null
let slider = null
let output = null
let parts = null
let sc = null

function dojoke() {
    menu.hidden = !menu.hidden
}

function update_slider(){
    var jk = parts[slider.value-1];
    p.innerHTML = handleText(jk);
    newjk = jk
    newjk = newjk.replaceAll("</br>", "\n")
    newjk = newjk.replaceAll("<br />", "\n")
    newjk = newjk.replaceAll("<br>", "\n")
    document.getElementById("text").value = newjk
    output.innerHTML = "Page "+slider.value;
}

function dofwd(){
    if(slider.value != slider.max) {
        slider.value++;
    }
    update_slider()
}

function doback(){
    if(slider.value != slider.min) {
        slider.value--;
    }
    update_slider()
}

function show_joke(index){
    parts = get_text_parts("texts\\"+jokes[index][1])
    var p = document.getElementById("p")
    var jk = parts[0];
    p.innerHTML = handleText(jk);

    newjk = jk
    newjk = newjk.replaceAll("</br>", "\n")
    newjk = newjk.replaceAll("<br />", "\n")
    newjk = newjk.replaceAll("<br>", "\n")

    document.getElementById("text").value = newjk

    console.log(parts)

    slider.max = parts.length
    slider.value = 1
    output.innerHTML = "Page 1";

    slider.oninput = function() {
        update_slider()
    }

    menu.hidden = true;
    sc.hidden = false
}

function make_tree(list, root){
    let res = ""

    let leafs = []
    let roots = []
    let branches = []

    for(let i = 0; i<list.length; i++){
        name = list[i][0];
        split = name.split("//")

        if(name.indexOf(root) == 0){
            after = name.substr(root.length)
            if(after.indexOf("//")==-1){
                leafs.push([i, after])
            }
            else{
                branch = after.substr(0,after.indexOf("//"))
                next_root = root + after.substr(0,after.indexOf("//")+2)

                if(!branches.includes(branch)) {
                    roots.push([next_root, branch])
                    branches.push(branch)
                }
            }
        }
    }

    console.log(root, leafs, roots)

    if(root == "root//") {
        res += "<ul id=\"example\">"
    }
    else{
        res += "<ul>"
    }

    for(let i = 0; i<leafs.length; i++){
        res += "<li><a href=\"#\" onclick=\"show_joke("+leafs[i][0]+")\">"+leafs[i][1]+"</a></li>"
    }

    for(let i = 0; i<roots.length; i++) {
        res += "<li>"+roots[i][1]
        res += make_tree(list, roots[i][0])
        res += "</li>"
    }

    res += "</ul>"
    return res;
}


function make_menu(){
    parsejokes()

    menu = document.getElementById("menudiv")
    sc = document.getElementById("sld")

    menu.hidden = true;
    let html = make_tree(jokes, "root//")

    console.log(html)

    menu.innerHTML = html

    tm = make_tree_menu('example');

    slider = document.getElementById("myRange");
    output = document.getElementById("demo");
    output.innerHTML = slider.value; // Display the default slider value
}

function parsejokes()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "jokes.txt", false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                prev = ""
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];

                    if(line.length > 0) {
                        split = line.split(';')
                        path = split[0]
                        name = split[1]
                        translated = split[2]
                        jokes.push([path, name, translated])
                    }
                }
            }
        }
    }

    rawFile.send(null);
}


function get_text_parts(name)
{
    let parts = []
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", name, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;

                let lines = allText.split(/\r?\n/);
                prev = null
                for (let i = 0; i < lines.length; i++) {
                    line = lines[i];
                    //line = line.replace(" ", " ");
                    //line = line.replace(" ", "-");

                    if(line != undefined) {
                        if (line.length > 0) {
                            if (line.indexOf("***") == -1) {
                                prev += line+"<br>"
                            } else {
                                if(prev != null) {
                                    parts.push(prev)
                                }
                                prev = ""
                            }
                        }
                    }
                }
            }
        }
    }

    rawFile.send(null);
    return parts
}


function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

function randomjoke(){
    if(jokes.length === 0){
        parsejokes()
    }

    res = jokes[randomInt(0, jokes.length - 1)]

    console.log(res)
    return res
}