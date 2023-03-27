// j'utilise un TRY/catch pour faire mon fetch car si l'api a un probleme il faut que je sois en mesure de
// traiter l'erreur 
try {
    fetch("http://localhost:3000/api/teddies")
.then(response => response.json())
.then((items) => {
for (let i = 0; i < items.length; i++) {
    displayElement(items[i]);
}
})
} catch (error) {
    console.error(error);
}


function displayElement(item) {
    let txt = document.getElementById("container_products");
    txt.innerHTML += `
    <div id="products">
    <a href="products.html?id=${item._id}" id="href_products">
                <img src="${item.imageUrl}" id="img_products">
                <p><strong>${item.name}</strong></p>
                <p>${item.description}</p>
                <p id="price"> <strong>${item.price / 100} € </strong></p>
            </div>
    </a>
    `;
}



// requete http 
// local storage 
// sync async 
// porter des variables let var const