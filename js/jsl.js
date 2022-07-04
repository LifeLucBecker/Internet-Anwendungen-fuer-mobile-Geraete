class ViewController {

    constructor() {


    }

    initialiseView() {
        this.mainEl = this.root.getElementsByTagName("main")[0];
        this.headerEl = document.getElementById("thumbnail");

        this.prepareViewSwitching();
        this.prepareFading();
        this.prepareListitemSelection();
        this.prepareAddingNewItems();

        this.loadDataFromServer();
    }

    prepareViewSwitching() {
        const viewSwitch = this.root.querySelector("header button:last-child");

        viewSwitch.onclick = () => {
            console.log("this: ", this);
            this.mainEl.classList.toggle("myapp-tiles");
        }
    }

    prepareFading() {
        const fadingTrigger = this.root.getElementsByClassName("switch-fading-button")[0];
        const onFadedListener = (evt) => {
            console.log("evt:", evt);
            this.mainEl.classList.toggle("myapp-faded");
            this.mainEl.removeEventListener("transitionend", onFadedListener);
            this.headerEl.classList.toggle("myapp-img-list");
        }
        fadingTrigger.onclick = () => {
            this.mainEl.classList.toggle("myapp-faded");
            this.mainEl.addEventListener("transitionend", onFadedListener);
        }
    }

    prepareListitemSelection() {
//        const listitems = this.root.getElementsByTagName("li");
//
//        let currentitem = null;
//
//        for (let i=0;i<listitems.length;i++) {
//            currentitem = listitems[i];
//            currentitem.onclick = (evt) => {
//                console.log("evt: ", evt);
//                alert("selected: " + this.lookupLi(evt.target).querySelector("h2").textContent);
//            }
//        }
//
//        console.log("after for loop, currentitem: ", currentitem);
        this.mainEl.querySelector("ul").onclick = (evt) => {
            confirm("selected: " + this.lookupLi(evt.target).querySelector("h2").textContent);
        }
    }

    lookupLi(el) {
//        if (el instanceof HTMLLIElement) {
//            return el;
//        }
//        else if (el instanceof HTMLBodyElement) {
//            alert("Something went wrong. LookupLi() reached document body!");
//        }
//        else if (el.parentNode) {
//            return this.lookupLi(el.parentNode);
//        }
//        else {
//            alert("Something went completely wrong, got element without parent node...");
//        }
        return el.closest("main li");
    }

    prepareAddingNewItems() {
        const addNewItemButton = this.root.querySelector("header button:nth-child(3)");
        addNewItemButton.onclick = (evt) => {
            evt.stopPropagation();
            const allitemdata = [[100, 200, "lirem"],
                [400, 100, "dopsum"],
                [250, 50, "olor"],
                [200, 300, "adipiscing"]
            ];
            const [x, y, title] = allitemdata[Date.now() % allitemdata.length];
            const newitem = {
                title: title,
                // src: "https://placekitten.com/" + itemdata[0] + "/" + itemdata[1];
                src: `https://placekitten.com/${x}/${y}`
            };
            console.log("newitem: ", newitem);
            this.bindItemtoView(newitem);
        }

        this.listviewRoot = this.root.getElementsByTagName("ul")[0];

        // C) handmade templating
        this.listitemviewTemplate = this.root.querySelector("main ul li");
        this.listitemviewTemplate.parentNode.removeChild(this.listitemviewTemplate);
        this.listitemviewTemplate.classList.remove("myapp-template");

        // D) standard templating
        // this.listitemviewTemplate = this.root.getElementsByTagName("template")[0];

    }

    bindItemtoView(item) {

        // A) template string with inner html

        // const itemview = `<li><img class="myapp-align-left" src="${item.src}"><h2 class="myapp-align-left">${item.title}</h2><button class="myapp-imgbutton myapp-align-right myapp-img-edit"></button></li>`;
        // console.log("itemview: ", itemview);
        //
        // this.listviewRoot.innerHTML += itemview;

        // B) dom api element creation

        // const itemview = document.createElement("li");
        // const img = document.createElement("img");
        // itemview.appendChild(img);
        // img.src = item.src;
        // img.classList.add("myapp-align-left");
        // const h2 = document.createElement("h2");
        // itemview.appendChild(h2);
        // h2.textContent = item.title;
        // h2.classList.add("myapp-align-left");
        // const button = document.createElement("button");
        // itemview.appendChild(button);
        // button.setAttribute("class", "myapp-imgbutton myapp-align-right myapp-img-edit");

        // C) handmade templating
        const itemview = this.listitemviewTemplate.cloneNode(true);
        itemview.querySelector(".myapp-img").src = item.src;
        itemview.querySelector(".myapp-title").textContent = item.title;

        // D) standard templating
        // const itemview = document.importNode(this.listitemviewTemplate.content, true).querySelector("li");
        // itemview.querySelector(".myapp-img").src = item.src;
        // itemview.querySelector(".myapp-title").textContent = item.title;

        this.listviewRoot.appendChild(itemview);

        itemview.scrollIntoView();

    }

    loadDataFromServer() {
        //  window.location += "data/listitems.json"

        //  1) XMLHttpRequest

        //    const xhreq = new XMLHttpRequest();
        //    xhreq.open("Get", "data/listitems.json");
        //    xhreq.onreadystatechange = () => {
        //        if (xhreq.readyState == 4 && xhreq.status == 200) {
        //            const responseObjects = JSON.parse(xhreq.responseText);
        //            responseObjects.forEach(obj => this.bindItemtoView(obj));
        //        }
        //    }
        //
        // xhreq.send();

        // 2) xhr "library function"

        // xhr("GET", "data/listitems.json", "null", xhreq => {
        //    const responseObjects = JSON.parse(xhreq.responseText);
        //    responseObjects.forEach(obj => this.bindItemtoView(obj));
        // });

        // 3)a fetch()

        // const responsePromise = fetch("data/listitems.json");
        // responsePromise
        //    .then(response => {
        //        console.log("response: " + response);
        //        console.log("response status: ", response.status);
        //        return response.text();
        //    })
        //    .then(text => {
        //        console.log("text: ", text);
        //       JSON.parse(text).forEach(obj => this.bindItemtoView(obj));
        //    });

        // 3)b await

        // const response = await fetch("data/listitems.json");
        // const text = await response.text();
        // const json = JSON.parse(text);
        // json.forEach(obj => this.bindItemtoView(obj));

        // 3)c

        fetch("data/listitems.json")
            .then(response => response.json())
            .then(json => json.forEach(obj => this.bindItemtoView(obj)));
    }

}

window.onload = () => {
    const vc = new ViewController();
    vc.root = document.body;
    vc.initialiseView();
}