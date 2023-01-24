/*             App con Fetch              */

let url = './data.json'
fetch(url)

    .then((res) => res.json())
    .then((data) => pageWeb(data))
    .catch((error) => console.log(error))

/*              app Page                   */


function pageWeb(productos) {

    let carrito = []
    let carritoJSON = ""
    let totalFinal = ""
    let unidades = ""
    let contenedor = document.getElementById("contenedor")
    let contenedorCarritoTotal = document.getElementById("contenedorCarritoTotal")
    let carritoRender = document.getElementById("cart-row")
    let total = document.getElementById("total")
    let cartNav = document.getElementById("cart-nav")
    let botonCarrito = document.getElementById("cart-button")
    let romance = document.getElementById("romance")
    let theriller = document.getElementById("theriller")
    let fantasticas = document.getElementById("fantastica")
    let misterio = document.getElementById("misterio")
    let input = document.getElementById("input")
    let button = document.getElementById("buscador")
    let store = document.getElementById("store")
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    botonCarrito.addEventListener("click", esconder)
    romance.addEventListener("click", filtroCategoria)
    theriller.addEventListener("click", filtroCategoria)
    fantasticas.addEventListener("click", filtroCategoria)
    misterio.addEventListener("click", filtroCategoria)
    button.addEventListener("click", buscar)
    store.addEventListener("click", renderizarTodo)

    renderizar(productos)
    comprobar(carrito)

    function comprobar() {
        if (localStorage.getItem("Carrito")) {
            carrito = JSON.parse(localStorage.getItem("Carrito"))
            renderizarCarro(carrito)
            totalRender(carrito)
        } else {
            totalRenderVacio(carrito)
        }
    }
    function renderizarTodo(e) {
        e.preventDefault()
        renderizar(productos)
    }
    
    /*                           Renderizar productos                  */
    function renderizar(array) {
        contenedor.innerHTML = ""
        for (const producto of array) {
            /* Desestructuracion en parametros */
            let { nombre, img, precio, id } = producto
            let tarjetaBody = document.createElement("div")
            tarjetaBody.className = "tarjetabody"
            tarjetaBody.innerHTML = `
                <div class="div-img" ><img class="thumbnail" src="${img}"></div>
                <div class="box-element product">
                    <h6><strong>${nombre}</strong></h6>
                    <h6 class= "precio"><strong>Price: $ ${precio.toFixed(2)}</strong></h6><hr>
                    <button id ="${id}" class="btn btn-outline-secondary add-btn update-cart">Add to Cart</button>
                    <a id ="view" class="btn btn-outline-success" href="#">View</a>
                </div>
                `
            contenedor.append(tarjetaBody)
        }
        let view = document.getElementsByClassName("btn btn-outline-success")
        for (btn of view) {
            btn.addEventListener("click", cartel)
        }
        let agregarCarrito = document.getElementsByClassName('btn btn-outline-secondary add-btn update-cart')
        for (boton of agregarCarrito) {
            boton.addEventListener("click", addItem)
        }
    }
    /*                         Agregar Productos al Carrito                   */
    function addItem(e) {
        let productoBuscado = productos.find(producto => producto.id == e.currentTarget.id)
        let indexProduct = carrito.findIndex(producto => producto.id == productoBuscado.id)
        
        if (indexProduct != -1) {
            carrito[indexProduct].unidades++
            carrito[indexProduct].subtotal = carrito[indexProduct].precio * carrito[indexProduct].unidades
            carritoJSON = JSON.stringify(carrito)
            localStorage.setItem("Carrito", carritoJSON)
        }
        else {
            carrito.push({ id: productoBuscado.id, nombre: productoBuscado.nombre, categoria: productoBuscado.categoria, precio: productoBuscado.precio, subtotal: productoBuscado.precio, unidades: 1, img: productoBuscado.img })
            carritoJSON = JSON.stringify(carrito)
            localStorage.setItem("Carrito", carritoJSON)
        }
        totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
        unidades = carrito.reduce((a, b) => a + b.unidades, 0)
        renderizarCarro(carrito)
        totalRender(carrito)
        tostada("Producto agregado al carrito", {
            background: "linear-gradient(to right,#047b89, #6fa5ab)",
        })
    }
    /*                     Renderizar Carrito                     */
    function renderizarCarro(array) {
        carritoRender.innerHTML = ""
        for (let producto of array) {
            /* Desestructuracion en parametros */
            let { nombre, img, precio, unidades, id, subtotal } = producto
            let cart = document.createElement("div")
            cart.className = "cart-render"
            cart.innerHTML = `
                <div class="cart-row">
                <div  style="flex:2"><img class="row-image" src="${img}"></div>
                <div  style="flex:2"><p class="cart-p">${nombre}</p></div>
                <div  style="flex:1"><p class="cart-p">$${precio.toFixed(2)}</p></div>
                <div style="flex:1">
                <div>
                <p class="quantity number">${unidades}</p>
                </div>
                <div class="quantity">
                <div class="apdown">
                <img id="${id}" class="chg-quantity update-cart " src="images/up.png">
                <img id="${id}" class="chg-quantity-2 update-cart" src="images/down.png">
                </div>
                <img id="${id}" class="chg-quantity-3 update-cart" src="images/trash.png">
                </div>
                </div>
                <div style="flex:1"><p class="cart-p">$${subtotal.toFixed(2)}</p></div>
                </div>
                `
            carritoRender.append(cart)
        }
        let add = document.getElementsByClassName("chg-quantity update-cart")
        for (let a of add) {
            a.addEventListener("click", addItem)
        }
        let remove = document.getElementsByClassName("chg-quantity-2 update-cart")
        for (let b of remove) {
            b.addEventListener("click", removeItem)
        }
        let trash = document.getElementsByClassName("chg-quantity-3 update-cart")
        for (let b of trash) {
            b.addEventListener("click", trashItem)
        }
    }
    /*               Eliminar Items del Carrito            */
    function trashItem(e) {
        let productoBuscado = productos.find(producto => producto.id == e.target.id)
        let indexProduct = carrito.findIndex(producto => producto.id == productoBuscado.id)
        if (indexProduct != -1) {
            if (carrito[indexProduct].unidades >= 2) {
                carrito[indexProduct].unidades = 0
                carrito[indexProduct].subtotal = carrito[indexProduct].subtotal - carrito[indexProduct].precio
                carritoJSON = JSON.stringify(carrito)
                localStorage.setItem("Carrito", carritoJSON)

                carrito.splice(indexProduct, 1)
                carritoJSON = JSON.stringify(carrito)
                localStorage.setItem("Carrito", carritoJSON)
            }
           
        }
        totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
        unidades = carrito.reduce((a, b) => a + b.unidades, 0)

        renderizarCarro(carrito)
        totalRender(carrito)
        tostada("Producto eliminado del carrito", {
            background: "linear-gradient(to right,  #e92424,  #da5353)",
        })

    }


    function removeItem(e) {
        let productoBuscado = productos.find(producto => producto.id == e.target.id)
        let indexProduct = carrito.findIndex(producto => producto.id == productoBuscado.id)
        if (indexProduct != -1) {
            if (carrito[indexProduct].unidades >= 2) {
                carrito[indexProduct].unidades--
                carrito[indexProduct].subtotal = carrito[indexProduct].subtotal - carrito[indexProduct].precio
                carritoJSON = JSON.stringify(carrito)
                localStorage.setItem("Carrito", carritoJSON)
            }
            else {
                carrito.splice(indexProduct, 1)
                carritoJSON = JSON.stringify(carrito)
                localStorage.setItem("Carrito", carritoJSON)
            }
        }
        totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
        unidades = carrito.reduce((a, b) => a + b.unidades, 0)

        renderizarCarro(carrito)
        totalRender(carrito)
        tostada("Producto eliminado del carrito", {
            background: "linear-gradient(to right,  #e92424,  #da5353)",
        })

    }
    /*                   Renderizar Total de Precio y Unidades del Carrito             */
    function totalRender(array) {
        totalFinal = carrito.reduce((a, b) => a + b.subtotal, 0)
        unidades = carrito.reduce((a, b) => a + b.unidades, 0)
        total.innerHTML = ""
        let totalResumen = document.createElement("div")
        totalResumen.className = "total"
        totalResumen.innerHTML = `
            <span class="close">&times;</span> 
            <h5 class="totalh5" >Items: <strong>${unidades} </strong></h5>
            <h5 class="totalh5" >Total:<strong> $ ${totalFinal.toFixed(2)}</strong></h5>
            <a id="clear" style="float:right; margin:5px;" type="button" class="btn btn-outline-success" href="#">Pagar</a>
            `
        total.append(totalResumen)
        let span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }
        cartNav.innerHTML = ""
        if (array.lenght != 0) {
            let parrafo = document.createElement("div")
            parrafo.className = "cart-total"
            parrafo.innerHTML = `<p>${unidades}</p>`
            cartNav.append(parrafo)
        } else {
            let parrafo = document.createElement("div")
            parrafo.className = "cart-total"
            parrafo.innerHTML = `<p>0</p>`
            cartNav.append(parrafo)
        }

        let clear = document.getElementById("clear")
        clear.addEventListener("click", borrarStorage)
    }
    function totalRenderVacio(array) {
        total.innerHTML = ""
        let totalResumen = document.createElement("div")
        totalResumen.className = "total"
        totalResumen.innerHTML = `
                <span class="close">&times;</span> 
                <h5 class="totalh5">Items: <strong>  0 </strong></h5>
                <h5 class="totalh5">Total:<strong> $ 0.00 </strong></h5>
                `
        total.append(totalResumen)
        cartNav.innerHTML = ""
        let parrafo = document.createElement("div")
        parrafo.className = "cart-total"
        parrafo.innerHTML = `<p>0</p>`
        cartNav.append(parrafo)

        let span = document.getElementsByClassName("close")[0];
        span.onclick = function () {
            modal.style.display = "none";
        }

    }
    /*       Eliminar Carrito del LocalStorage  */
    function borrarStorage() {
        localStorage.removeItem("Carrito")
        Swal.fire({
            title: '<hr><strong>Gracias por su compra!</strong><br><br><br>',
            imageUrl: './images/logo.png',
            imageHeight: 100,
            imageAlt: 'logo',
            icon: "success",
            showConfirmButton: false,
            backdrop: `rgba(193, 188, 190, 0.65)`,
            timer: 2500,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        contenedorCarritoTotal.className = "container"
        modal.style.display = "none";
        carrito = []
        totalRenderVacio(carrito)
        renderizarCarro(carrito)
        renderizar(productos)
    }
    /*                    Alerts / Librerias                  */
    function cartel() {
        Swal.fire({
            title: "Proximamente!",
            showConfirmButton: false,
            timer: 1000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }
    function tostada(text, style) {
        Toastify({
            text: text,
            style: style,
            duration: 1000,
            gravity: "bottom",
            position: "right",
        }).showToast();
    }
    /*                   Modal                  */
    function esconder(e) {
        modal.style.display = "block";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    /*                       Buscador       Filtros                        */
    function filtroCategoria(e) {
        e.preventDefault()
        let categoriaFiltrado = productos.filter(producto => producto.categoria.toLowerCase() == e.currentTarget.id)
        renderizar(categoriaFiltrado)
    }
    function buscar(e) {
        e.preventDefault()
        let productoFiltrado = productos.filter(producto => producto.nombre.toLowerCase().includes(input.value.toLowerCase()) || producto.categoria.toLowerCase().includes(input.value.toLowerCase()))
        renderizar(productoFiltrado)
    }
}