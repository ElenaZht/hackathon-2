async function bringSales() {
    document.getElementsByClassName('spinner1')[0].style.display = 'flex'
    try {
        const response = await fetch('http://localhost:3000/items/sales')
        if (response.status == 200){
            const sales = await response.json()
            document.getElementsByClassName('spinner1')[0].style.display = 'none'

            return sales
        } else {
            console.log('faild to bring sales')
            document.getElementsByClassName('spinner1')[0].style.display = 'none'

        }

    } catch (error) {
        console.error(error)
        document.getElementsByClassName('spinner1')[0].style.display = 'none'

    }
}

async function bringItemsByCategory() {
    const chosenCategory = document.getElementById('categorySelect').value
    document.getElementsByClassName('spinner2')[0].style.display = 'flex'


    try {
        const response = await fetch(`http://localhost:3000/items/${chosenCategory}`)
        if (response.status == 200){
            const categoryItems = await response.json()
            document.getElementsByClassName('spinner2')[0].style.display = 'none'

            return categoryItems
        } else {
            console.log('faild to bring items')
            document.getElementsByClassName('spinner2')[0].style.display = 'none'

        }

    } catch (error) {
        console.log('faild to bring items')
        document.getElementsByClassName('spinner2')[0].style.display = 'none'

    }
}

function createItemCard(item){
    const card = document.createElement('div')
    card.classList.add('card')
    const title = document.createElement('h3')
    title.textContent = item.title
    const price = document.createElement('h4')
    price.textContent = item.price + '₪'
    const image = document.createElement('div')
    image.classList.add('img')
    image.style.backgroundImage = "url('./assets/images/paw.png')"
    if (item.onsale){
        price.style.backgroundColor = '#E0F000'
    }
    const addButton = document.createElement('button')
    addButton.classList.add('addButton')
    addButton.textContent = '+'
    addButton.dataset.id = item.id; // store item obj inside button to get access to it by click
    addButton.dataset.title = item.title;
    addButton.dataset.price = item.price;
    addButton.addEventListener('click', (e) => {
        e.preventDefault()
        addItemToCart(e)
    })
            

    card.appendChild(image)
    card.appendChild(title)
    card.appendChild(price)
    card.appendChild(addButton)
    return card
}

function displaySaleItems(items) {
    const searchInput = document.getElementById('searchInput').value
    const parent = document.getElementById('saleItems')
    parent.innerHTML = ''
    
    for (let item of items){
        if (item.title.toLowerCase().includes(searchInput.toLowerCase())){
            const newItem = createItemCard(item)
            parent.appendChild(newItem) 
        }
    }
}

function displayItemsByCategory(items){
    const parent = document.getElementById('categoryItems')
    parent.innerHTML = ''
    for (let item of items){
        const newItem = createItemCard(item)
        parent.appendChild(newItem) 
    }

}

async function navigateToCategory(category, event) {
    event.preventDefault()
    document.getElementById('categorySelect').value = category
    const categoryItems = await bringItemsByCategory()
    displayItemsByCategory(categoryItems)
    document.getElementById("category").scrollIntoView({ behavior: "smooth" })

}

function addItemToCart(e){
    console.log('add item func')
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart) {  // in case it is missing
        cart = [];
    }

    if (e.target.classList.contains('addButton')) {
        const button = e.target;
        const product = {
            id: button.dataset.id,
            title: button.dataset.title,
            price: button.dataset.price
        };
        cart.push(product)
        //add to local storage
        localStorage.setItem('cart', JSON.stringify(cart))

        displayCart()
        document.querySelector('section[id="cart"] button').style.display = 'flex'
    }
}

function removeFromCart(item){
    //remove from store
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (!cart) {  // in case it is missing
        cart = [];
        displayCart()
        return
    }
    const idx = cart.findIndex(cartItem => cartItem.title === item.title)
    console.log('idx to remove ', idx)
    if (idx !== -1){
        cart.splice(idx, 1)
        localStorage.setItem('cart', JSON.stringify(cart))
        displayCart()
    }
 
}

function displayCart(){
    let cart = JSON.parse(localStorage.getItem('cart'));
    console.log('display cart: ', cart)
    const cart_container = document.querySelector('div.list ul')
    cart_container.innerHTML = ''
    let sum = 0
    for (let i of cart){
        const item = document.createElement('p')
        item.textContent = i.title + ' ' + i.price + '₪'
        cart_container.appendChild(item)
        const remButton = document.createElement('button')
        remButton.textContent = 'x'
        remButton.addEventListener('click', (e) => {
            e.preventDefault()
            removeFromCart(i)
        })
        item.appendChild(remButton)
        sum += +i.price
    }
    cart_container.appendChild(document.createElement('hr'))
    const total = document.createElement('p')
    total.textContent = "Total: " + sum.toFixed(2) + '₪'
    cart_container.appendChild(total)
}

async function transactionImitation(){
    let cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart){
        localStorage.setItem('cart', JSON.stringify([]))
        return
    }
    if (cart.length) {
        
        try {
            let resp = await fetch('http://localhost:3000/items/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart })
            });

            if (resp.status === 200){
                //success
                const orderInfo = await resp.json()
                const orderID = orderInfo.orderId
                cart = []
                localStorage.setItem('cart', JSON.stringify(cart))
                displayCart()

                const cart_container = document.querySelector('div.list ul')
                const kabalah = document.createElement('div')
                kabalah.classList.add('kabalah')
                kabalah.innerHTML = `<h1>Thank you!</h1><h4>your order already being proccessing</h4><hr><p>Order ID:  ${orderID}</p>`
                cart_container.appendChild(kabalah)
            } else {
                //fail
                const cart_container = document.querySelector('div.list ul')
                const failMessage = document.createElement('div')
                failMessage.classList.add('kabalah')
                failMessage.innerHTML = '<h1>Ooops!</h1><h4>your order failed, try again latter</h4>'
                cart_container.appendChild(failMessage)
            }
             

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

async function renderItemsOnSale(){
    const itemsOnSale = await bringSales()
    displaySaleItems(itemsOnSale)
}

async function renderItemsByCategory() {
    const itemsOfCategory = await bringItemsByCategory()
    displayItemsByCategory(itemsOfCategory)
}

async function renderCart() {
    //create cart in local store
    let cart = JSON.parse(localStorage.getItem('cart'))
    if (!cart){
        localStorage.setItem('cart', JSON.stringify([]));
    }
    displayCart() 
}

async function addEventListeners(){

    // *********** home section ***********

        // home section - go to sales button
        const goToSalesBtn = document.getElementById('goToSalesBtn')
        goToSalesBtn.addEventListener('click', (e) => {
            e.preventDefault()
            document.getElementById("sales").scrollIntoView({ behavior: "smooth" })
        })
        // home section - pet buttons
            //cats button
            const catPetButton = document.getElementById('catPetButton')
            catPetButton.addEventListener('click', async (e) => {
            navigateToCategory('Cats', e)
            })
            //digs button
            const dogPetButton = document.getElementById('dogPetButton')
            dogPetButton.addEventListener('click', (e) => {
                navigateToCategory('Dogs', e)
            })
            //birds button
            const birdPetButton = document.getElementById('birdPetButton')
            birdPetButton.addEventListener('click', (e) => {
                navigateToCategory('Birds', e)
            })
            //rodents button
            const rodentPetButton = document.getElementById('rodentPetButton')
            rodentPetButton.addEventListener('click', (e) => {
                navigateToCategory('Rodents', e)
            })
            //fish button
            const fishPetButton = document.getElementById('fishPetButton')
            fishPetButton.addEventListener('click', (e) => {
                navigateToCategory('Fish', e)
            })
    // ------------------------------------
    
    // *********** sales section ***********

        // sales section - search
        const searchButton = document.getElementById('searchButton')
        const itemsOnSale = await bringSales()
        searchButton.addEventListener('click',  (e) => {
            e.preventDefault()
            displaySaleItems(itemsOnSale)
        })
        const searchInput = document.getElementById('searchInput')
        searchInput.addEventListener('input', (e) => {
        e.preventDefault()
        displaySaleItems(itemsOnSale)
        })
    // ------------------------------------

    // *********** category section ***********

        //category section - select category
        const selectCategory = document.getElementById('categorySelect')
        selectCategory.addEventListener('change', async (e) => {
            e.preventDefault()
            const categoryItems = await bringItemsByCategory()
            displayItemsByCategory(categoryItems)
        })
    // ------------------------------------

    // *********** cart section ***********

        // cart section - closing kabalah by side click
        const cartSection = document.querySelector('section[id="cart"]')
        cartSection.addEventListener('click', (e) => {
            e.preventDefault()
            const kabalah = document.getElementsByClassName('kabalah')[0]
            if (kabalah){
                kabalah.style.display = 'none'
            }
        })

        //cart section - buy now button
        const buy = document.getElementById('buy')
        buy.addEventListener('click', (e) => {
            e.preventDefault()
            transactionImitation()
        })
    // ------------------------------------
}

async function main(){
    //activate spinner
    document.getElementsByClassName('spinner0')[0].style.display = 'flex' 

    // render dynamic content
    await renderItemsOnSale()
    await renderItemsByCategory()
    await renderCart()

    // provide eventListeners
    addEventListeners()

    // deactivate spinner
    document.getElementsByClassName('spinner0')[0].style.display = 'none'

}
main()