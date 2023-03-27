let produitDansLocalStorage = JSON.stringify(localStorage.getItem("orderId"));


let orderId = document.getElementById("orderId");

orderId.innerHTML = `${produitDansLocalStorage}`;

localStorage.clear();


