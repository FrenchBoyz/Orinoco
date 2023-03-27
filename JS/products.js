// j'utilise l'objet window location search pour recuperer l'url entier
let url_id = window.location.search;
// je supprime les caractere (?=id)  avec la methode slice
let id = url_id.slice(4);


fetch(`http://localhost:3000/api/teddies/${id}`)
.then(response => response.json())
.then((items) => {
    for (let i = 0; i < items.length; i++) {
    teddies(items[i])
    }

    // je cible la zone ou injecter mon code html 
    let products = document.getElementById('container_products');


// j'injecte mon code html contenant les donnée de l'api
    products.innerHTML = `
    <div id="products_page" class="col-lg-6">
        <img src="${items.imageUrl}"  alt="image d'une peluche" id="img-products">
        <p id="name_products"><strong>${items.name}</strong></p>
        <p>${items.description}</p>
        <p>${items.price / 100} €</p>
        <label for="optionProducts"></label>
                  <select name="optionsProducts" id="optionQuantity"> 
                   <option value="1">1</option>
                   <option value="2">2</option>
                   <option value="3">3</option>
                   <option value="4">4</option>
                   <option value="5">5</option>
                   <option value="6">6</option>
                   <option value="7">7</option>
                   <option value="8">8</option>
                   <option value="9">9</option>
                   <option value="10">10</option>
                  </select>
                  <label for="optionProducts"></label>
                  <select name="optionsProducts" id="optionProducts">
                  </select>
                </form>
                <button id="btn-envoyer" type="submit" name="btn-envoyer">Commander l'article</button>
    </div>
    `;
    // boucle for pour parcourir ma liste de couleur pour pouvoir l'afficher dans les options 
    for (let index = 0; index < items.colors.length; index++) {
        document.getElementById('optionProducts').innerHTML += `<option value="${items.colors[index]}">${items.colors[index]}</option>`; 
    }

    // ecouter le click sur le boutton <<<<ajouter au panier>>>>
    let btn_submit = document.querySelector('#btn-envoyer');

    // au click envoyer les valeurs dans le LocalStorage 
    btn_submit.addEventListener("click", (event)=>{
        let quantity = document.getElementById("optionQuantity").value;
        let colors = document.getElementById("optionProducts").value;
      
        let products = {
            id : items._id,
            option : colors,
            quantity : quantity,
            nom : items.name,
            prix : items.price / 100,
        }
        
        // utilisation d'une ALERT personnalisé pour un design plus agréable
            swal({
                title: "Let's go au panier ?",
                text: "Cliquez sur OK pour aller au panier ",
                icon: "success",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                  window.location.href="cart.html"
                }
              });
        
        //-------------------------------------------------- LOCAL STORAGE -------------------------------------------------------

        let produitEnregistreLocalStorage = JSON.parse(localStorage.getItem("products"));

        if (!produitEnregistreLocalStorage) {
            produitEnregistreLocalStorage = [];
        } 
        let pdtExist = produitEnregistreLocalStorage.find(x => x.id === products.id && x.option === products.option);
        console.log(pdtExist)
        if(pdtExist){
          let indiceElement = produitEnregistreLocalStorage.indexOf(pdtExist);
          produitEnregistreLocalStorage[indiceElement].quantity = parseInt(produitEnregistreLocalStorage[indiceElement].quantity) + parseInt(products.quantity);
         
          
        }else{
          console.log(products);
          produitEnregistreLocalStorage.push(products);
        }
        
    
        // la transformation au format JSON et l'envoyer dans la key "produtcs" du localstorage
        localStorage.setItem("products",JSON.stringify(produitEnregistreLocalStorage));
    })
})

