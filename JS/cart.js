let produitDansLocalStorage = JSON.parse(localStorage.getItem("products"));

let tableauInject = document.getElementById("tableauInject");


// fonction du panier vide sert à vider le panier
function panierVide (){
let emptyCart = `
    <div class="container-panier-vide">
        <p id="emptyTab"> VOTRE PANIER EST VIDE </p>
    </div> `;
    tableauInject.innerHTML = emptyCart;
};

if (produitDansLocalStorage == null || produitDansLocalStorage == 0) {
    panierVide ();
} else {
    let structurePanier = [];
    for (let index = 0; index < produitDansLocalStorage.length; index++) {
     structurePanier += `
    <tr id="${produitDansLocalStorage[index].id}">
    <td>${produitDansLocalStorage[index].nom}</td>
    <td>${produitDansLocalStorage[index].quantity}</td>
    <td>${produitDansLocalStorage[index].option}</td>
    <td id="prix">${produitDansLocalStorage[index].prix * produitDansLocalStorage[index].quantity}&nbsp; €</td>
    <td> <a href "javascript:window.location.reload()"> <button data-id="${produitDansLocalStorage[index].id_produit}" class="deleteItem" OnClick="SupprimeProduit(this)">Supprimé</button> </td> </a>
    </tr>
    `;  
     tableauInject.innerHTML = structurePanier;
    
}
}

// 1) je parcour le localStorage avec une boucle for pour recuperer le PRIX et la QUANTITE 
// 2) je creer une variable total qui est egal a PRIX * QUANTITE  et je l'affiche dans mon html
let total = 0;
if (!produitDansLocalStorage == 0) {
    for (let index = 0; index < produitDansLocalStorage.length; index++) {
    total = total + produitDansLocalStorage[index].prix * produitDansLocalStorage[index].quantity;
    montantTotal.innerHTML = `${total} €`;    
}
}




// si le localStorage est vide alors le formulaire n'est pas présent dans le cas contraire je l'affiche
let formulaire = document.getElementById("form");

if (produitDansLocalStorage == null || produitDansLocalStorage == 0) {
    formulaire.innerHTML = ``;
} else {
    formulaire.innerHTML += `
    <p id="adresse-livraison">ADRESSE DE LIVRAISON</p>
                <form>
                    <label for="name">Nom</label>
                    <input type="text" placeholder="Nom" id="name">

                    <label for="">Prénom</label>
                    <input type="text" placeholder="Prénom" id="firstName">
                    
                    <label for="nom">Adresse</label>
                    <input type="text" placeholder=Adresse" id="address">

                    <label for="nom">E-mail</label>
                    <input type="text" placeholder="E-mail" id="email">

                    <label for="nom">Ville</label>
                    <input type="text" placeholder="Ville" id="city">
                    <br>
                    <br>
                    <button id="btn-envoyer" type="submit" name="btn-envoyer">PAYER</button>
                </form>
    `;
}

function SupprimeProduit(button) {

    produitDansLocalStorage = JSON.parse(localStorage.getItem("products"));

    // j'utilise la methode FIND pour trouver un element qui verifie une condition 
    let find = produitDansLocalStorage.find(x => x.id_produit == button.getAttribute("data-id"));
    // j'utilise la methode INDEXof pour trouver l'indice de la position dans un array
    let indice = produitDansLocalStorage.indexOf(find);
    // j'utilise la methode SPLICE pour suprimer l
    produitDansLocalStorage.splice(indice,1);


      // je modifie le localstorage
     localStorage.setItem("products", JSON.stringify(produitDansLocalStorage));
     // Je supprime l'article sur le front end
     document = document.getElementById(button.getAttribute("data-id")).remove();
     
   }

   

   // suppression total du panier au click
   function deleteCart (){
     if (produitDansLocalStorage == null || produitDansLocalStorage == 0) {
         
     }else{
         localStorage.clear();
         document.getElementById("tableauInject").remove();
         window.location.reload();        
     }  
   }
   

   // je recupere les valeurs du formulaire 
   let nom = document.getElementById("name");
   let firstName = document.getElementById("firstName");
   let email = document.getElementById("email");
   let city = document.getElementById("city");
   let address = document.getElementById("address");


   let btn_send = document.getElementById('btn-envoyer');
    
   // si mon localStorage n'est pas vide j'écoute le click sur btn submit 
   if (btn_send) {
    btn_send.addEventListener('click', (event)=>{   
    event.preventDefault();
    let contact = {
        lastName : nom.value,
        firstName: firstName.value,
        email : email.value,
        city : city.value,
        address : address.value,
    }


     // ------------------------- GESTION DE LA VALIDATION DU FORMULAIRE --------------------------------------//
    function name_control (){
        if (/^[A-Za-z]{3,20}$/.test(contact.firstName))
        {
            return true;
        } else 
        {
            return false;
        } 
    };
    
    function lastname_control (){
        if (/^[A-Za-z]{3,20}$/.test(contact.lastName))
        {
            return true;
        }else 
        {
            return false;
        } 
    };
    
    function ValidateEmail(){
        if ( /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(contact.email))
        {
            return (true)
        }else{
            return (false)
        }
    };
    
    function street (){
        if (/^[a-zA-Z0-9\s,'-]*$/.test(contact.address))
        {      
            return true;
        }else 
        {      
            return false;
        } 
    };
    
    function cityValide (){
        if (/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/.test(contact.city)) {
            return true;
        } else {
            return false;
        }
    }
    // si toute les function ( regex ) return true alors j'execute ce code 
    if (cityValide () &&  name_control () && lastname_control () && ValidateEmail() && street()) {
        window.localStorage.setItem("formulaire",JSON.stringify(contact))
        
        let products = [];
        produitDansLocalStorage.forEach(element => {
            products.push(element.id)
        
        });
        
        // total a envoyer au local storage
        let sendData = {
            contact,
            products
        }
        console.log(sendData);

        fetch("http://localhost:3000/api/teddies/order",{
            method : "POST",
            body  :JSON.stringify(sendData),
            headers: {
              "Content-Type" : "application/json; charset=UTF-8",
            }
          })
          .then(response=> response.json())
          .then(json => {
              // l'api me donne en retourne un OrderId  
              // je le stock donc dans le local storage pour le recuperer sur la page SUMMARY.html
              localStorage.setItem("orderId",json.orderId)
              document.location.href='summary.html';
          });
    } else {
        swal("Erreur", "Veuillez remplir le formulaire correctement!", "error");
    }

   

   })   
   }
  
  