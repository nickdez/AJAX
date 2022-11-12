const gifArea = document.getElementById("gif-area");
const search = document.getElementById("gif-input");
const gifForm = document.getElementById("gif-form");
const removeBtn = document.getElementById("Remove")

function addGif(res) {
    let numResults = res.data.length;
    if (numResults) {
        let randomIdx = Math.floor(Math.random() * numResults);
        let newColumn = document.createElement("DIV");
        let newGif = document.createElement("IMG");
        newGif.classList.add("new-gif")
        newGif.setAttribute("src", res.data[randomIdx].images.original.url)
        newColumn.append(newGif);
        gifArea.append(newColumn)
    }
}

gifForm.addEventListener("submit", async function (evt) {
    evt.preventDefault();

    let searchItem = search.value;

    const res = await axios.get("http://api.giphy.com/v1/gifs/search", {
        params: {
            q: searchItem,
            api_key: "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym"
        }
    });
    addGif(res.data);
});

removeBtn.addEventListener("click", function () {
    let gifs = document.querySelectorAll(".new-gif");
    gifArea.remove(gifs);
})










