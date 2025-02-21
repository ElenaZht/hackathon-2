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

function addItemToCart(e, cart){
    e.preventDefault()
    if (e.target.classList.contains('addButton')) {
        const button = e.target;
        const product = {
            id: button.dataset.id,
            title: button.dataset.title,
            price: button.dataset.price
        };
        cart.push(product)
        displayCart(cart)
        document.querySelector('section[id="cart"] button').style.display = 'flex'
    }
}

function displayCart(cart){
    const cart_container = document.querySelector('div.list ul')
    cart_container.innerHTML = ''
    let sum = 0
    for (let i of cart){
        console.log(i)
        const item = document.createElement('p')
        item.textContent = i.title + ' ' + i.price + '₪'
        cart_container.appendChild(item)
        sum += +i.price
    }
    cart_container.appendChild(document.createElement('hr'))
    const total = document.createElement('p')
    total.textContent = "Total: " + sum.toFixed(2) + '₪'
    cart_container.appendChild(total)
}

function transactionImitation(cart){
    if (cart.length){
        cart = []
        const cart_container = document.querySelector('div.list ul')
        const kabalah = document.createElement('div')
        kabalah.classList.add('kabalah')
        kabalah.innerHTML = '<h1>Thank you!</h1><h4>your order already being proccessing</h4><hr><p>Order ID:  23456</p>'
        cart_container.appendChild(kabalah)
    }
}

async function main(){
    let resp = await fetch('http://localhost:3000/cart')
    let cart = await resp.json()

    document.getElementsByClassName('spinner0')[0].style.display = 'flex'

    const itemsOnSale = await bringSales()
    displaySaleItems(itemsOnSale)

    
    const searchButton = document.getElementById('searchButton')
    searchButton.addEventListener('click',  (e) => {
        e.preventDefault()
        displaySaleItems(itemsOnSale)
   })
    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('input', (e) => {
        e.preventDefault()
        displaySaleItems(itemsOnSale)
   })

   const itemsOfCategory = await bringItemsByCategory()
   displayItemsByCategory(itemsOfCategory)

   //go to sales button
   const goToSalesBtn = document.getElementById('goToSalesBtn')
   goToSalesBtn.addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById("sales").scrollIntoView({ behavior: "smooth" })
   })

   //select category
   const selectCategory = document.getElementById('categorySelect')
   selectCategory.addEventListener('change', async (e) => {
        e.preventDefault()
        const categoryItems = await bringItemsByCategory()
        displayItemsByCategory(categoryItems)
   })

   //pet buttons
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

    //add to cart button
    const addButton = document.getElementsByClassName('addButton')
    Array.from(addButton).forEach(button => {
        button.addEventListener('click', (e) => {
            addItemToCart(e, cart);
        });
    });

    //buy now button
    const buy = document.getElementById('buy')
    buy.addEventListener('click', (e) => {
        e.preventDefault()
        transactionImitation(cart)
    })
    document.getElementsByClassName('spinner0')[0].style.display = 'none'

}
main()