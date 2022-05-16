
let listData = [];
const dataUri = window.location.href.trimEnd().toLocaleLowerCase().replace("index.html", "") + "data/listitems.json";

if (typeof Element.prototype.clearChildren === 'undefined') {
    Object.defineProperty(Element.prototype, 'clearChildren', {
        configurable: true,
        enumerable: false,
        value: function () {
            while (this.firstChild) this.removeChild(this.lastChild);
        }
    });
}

const switchView = async () => {
    var btn = document.getElementById("btn-viewSwitch");
    var list = document.getElementsByClassName("list")[0];

    list.classList.add("invisible");
    await setTimeout(async () => {
        list.classList.remove("invisible");
        list.classList.toggle("grid");
        list.classList.add("visible");
        await setTimeout(() => {
            list.classList.remove("visible");
            if (list.classList.contains("grid")) {
                btn.children[0].src = "./assets/glyphicons-115-list.png"
            } else {
                btn.children[0].src = "./assets/glyphicons-157-show-thumbnails.png"
            }
        }, 1000)
    }, 2000)
}

const listItemClick = (ev) => {
    alert(ev.target.closest("div.list-item").querySelector(".primary-text").textContent)
}
const optionClick = async (ev) => {
    const url = ev.target.closest("div.list-item").querySelector(".cover").src;
    const title = ev.target.closest("div.list-item").querySelector(".primary-text").textContent;
    const item = ev.target.closest("div.list-item");

    const index = [...item.parentElement.children].indexOf(item);

    if (confirm(`${url}\n${title}\n`)) {
        listData.splice(index, 1)
    }
    await fillList();
    ev.preventDefault();
    ev.stopPropagation();
}
const refreshClick = async () => {
    await fetchListData();
    console.log("uhuh")
}
const addClick = async () => {
    listData.push({
        title: "Some Title",
        src: "https://placekitten.com/200/150",
        numOfTags: Math.floor(Math.random() * 100),
        added: (new Date()).toLocaleDateString(),
        owner: "placekitten.com"
    })
    await fillList();
}
const attachHandlers = () => {
    document.getElementById("btn-viewSwitch").onclick = switchView
    document.getElementById("btn-reload").onclick = refreshClick
    document.getElementById("btn-add").onclick = addClick

}

const createItem = ({ title, src, numOfTags, added, owner }) => {
    var element = document.createElement("div");
    element.classList.add("list-item")
    element.innerHTML = `<div class="column center">
    <div class="cover-wrapper">
        <img class="cover" src="${src}" alt="album cover">
        <button class="bottom overlay-bottom-right btn-option">
            <img class="inline-img-m" src="./assets/glyphicons-518-option-vertical.png"
                alt="main menu icon" />
        </button>
    </div>
</div>
<div class="column grow">
    <span>${owner}</span>
    <span class="primary-text font-size-l">${title}</span>
    <span class="bottom">▶${numOfTags}</span>
</div>
<div class="column right">
    <span>${added}</span>
    <button class="bottom btn-option">
        <img class="inline-img-m" src="./assets/glyphicons-518-option-vertical.png"
            alt="main menu icon" />
    </button>
</div>`
    return element
}
const fillList = (data) => {
    if (!data) {
        data = listData;
    }
    const list = document.getElementsByClassName("list")[0]
    list.clearChildren();
    data.forEach(element => list.appendChild(createItem(element)))
    Array.from(document.getElementsByClassName("btn-option")).forEach(element => {
        element.onclick = optionClick
    });
    Array.from(document.getElementsByClassName("list-item")).forEach(element => {
        element.onclick = listItemClick
    });

}

const refetchListData = async () => await fetch(dataUri).then(response => response.json())
    .then(data => { listData = data; fillList(data) });

window.onload = async () => {
    await refetchListData();
    attachHandlers();
};