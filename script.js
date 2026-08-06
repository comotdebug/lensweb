/* =====================================================
   LENSORA - JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const overlay = document.getElementById("overlay");

const loginBtn = document.getElementById("loginBtn");
const footerLogin = document.getElementById("footerLogin");

const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");

const wishlistBtn = document.getElementById("wishlistBtn");

const newsletterForm =
    document.getElementById("newsletterForm");

const promoBtn =
    document.getElementById("promoBtn");

const viewAllBtn =
    document.getElementById("viewAllBtn");

const productGrid =
    document.getElementById("productGrid");

const categoryButtons =
    document.querySelectorAll(".category-card");

const addCartButtons =
    document.querySelectorAll(".add-cart");

const wishlistButtons =
    document.querySelectorAll(".wishlist-btn");


/* =====================================================
   CART DATA
===================================================== */

let cart = [];


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);

}


/* =====================================================
   SEARCH
===================================================== */

searchBtn.addEventListener("click", () => {

    searchBox.classList.add("active");

    searchInput.focus();

});


closeSearch.addEventListener("click", () => {

    searchBox.classList.remove("active");

    searchInput.value = "";

    showAllProducts();

});


/* SEARCH PRODUCT */

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.toLowerCase().trim();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();

        const category =
            product.dataset.category.toLowerCase();

        if (
            name.includes(keyword) ||
            category.includes(keyword)
        ) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

});


/* =====================================================
   CART OPEN / CLOSE
===================================================== */

cartBtn.addEventListener("click", () => {

    cartSidebar.classList.add("active");

    overlay.classList.add("active");

});


closeCart.addEventListener("click", closeCartSidebar);

overlay.addEventListener("click", () => {

    closeCartSidebar();

    closeLoginModal();

});


function closeCartSidebar() {

    cartSidebar.classList.remove("active");

    overlay.classList.remove("active");

}


/* =====================================================
   ADD TO CART
===================================================== */

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);


        const existingProduct =
            cart.find(item => item.name === name);


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        updateCart();

        cartSidebar.classList.add("active");

        overlay.classList.add("active");


        showToast(
            `${name} ditambahkan ke keranjang 🛒`
        );

    });

});


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Tambahkan kamera pilihanmu.
                </p>

            </div>

        `;

        cartCount.textContent = "0";

        cartTotal.textContent =
            formatRupiah(0);

        return;

    }


    let total = 0;

    let totalQuantity = 0;


    cart.forEach((item, index) => {

        total +=
            item.price * item.quantity;

        totalQuantity +=
            item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">
                📷
            </div>

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${formatRupiah(item.price)}
                </p>

                <small>
                    Jumlah: ${item.quantity}
                </small>

            </div>

            <button
                class="remove-item"
                data-index="${index}"
            >
                ✕
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartCount.textContent =
        totalQuantity;


    cartTotal.textContent =
        formatRupiah(total);


    /* REMOVE CART ITEM */

    const removeButtons =
        document.querySelectorAll(".remove-item");


    removeButtons.forEach(button => {

        button.addEventListener("click", () => {

            const index =
                Number(button.dataset.index);

            cart.splice(index, 1);

            updateCart();

        });

    });

}


/* =====================================================
   LOGIN MODAL
===================================================== */

loginBtn.addEventListener("click", openLoginModal);


footerLogin.addEventListener("click", (event) => {

    event.preventDefault();

    openLoginModal();

});


function openLoginModal() {

    loginModal.classList.add("active");

    overlay.classList.add("active");

}


closeLogin.addEventListener("click", closeLoginModal);


function closeLoginModal() {

    loginModal.classList.remove("active");

    overlay.classList.remove("active");

}


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (!username || !password) {

        showToast(
            "Username dan password wajib diisi."
        );

        return;

    }


    /*
       SIMULASI LOGIN

       Nanti bisa kita bikin:

       admin
       customer

       dengan dashboard yang berbeda.
    */


    if (username.toLowerCase() === "admin") {

        showToast(
            "Login sebagai Admin berhasil 👨‍💼"
        );

    } else {

        showToast(
            `Selamat datang, ${username}! 👋`
        );

    }


    closeLoginModal();

    loginForm.reset();

});


/* =====================================================
   WISHLIST
===================================================== */

wishlistBtn.addEventListener("click", () => {

    showToast(
        "Wishlist kamu masih kosong ♡"
    );

});


wishlistButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.dataset.liked === "true") {

            button.dataset.liked = "false";

            button.textContent = "♡";

            showToast(
                "Dihapus dari wishlist."
            );

        } else {

            button.dataset.liked = "true";

            button.textContent = "♥";

            showToast(
                "Ditambahkan ke wishlist ❤️"
            );

        }

    });

});


/* =====================================================
   CATEGORY FILTER
===================================================== */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category =
            button.dataset.category;


        const products =
            document.querySelectorAll(".product-card");


        products.forEach(product => {

            const productCategory =
                product.dataset.category;


            /*
                Lens dan Accessories
                belum punya produk khusus.

                Jadi sementara kita tampilkan
                semua produk untuk kategori tersebut.
            */

            if (
                category === "Lens" ||
                category === "Accessories"
            ) {

                product.style.display = "";

            } else if (
                productCategory === category
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });


        document
            .getElementById("products")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            `Kategori: ${category}`
        );

    });

});


/* =====================================================
   VIEW ALL PRODUCTS
===================================================== */

viewAllBtn.addEventListener("click", () => {

    showAllProducts();

});


function showAllProducts() {

    const products =
        document.querySelectorAll(".product-card");


    products.forEach(product => {

        product.style.display = "";

    });

}


/* =====================================================
   PROMO BUTTON
===================================================== */

promoBtn.addEventListener("click", () => {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });


    showToast(
        "Menampilkan produk terbaik untukmu ✨"
    );

});


/* =====================================================
   NEWSLETTER
===================================================== */

newsletterForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const email =
        document.getElementById("emailInput").value.trim();


    if (!email) {

        showToast(
            "Masukkan email terlebih dahulu."
        );

        return;

    }


    showToast(
        "Berhasil subscribe! 📩"
    );


    newsletterForm.reset();

});


/* =====================================================
   CHECKOUT
===================================================== */

const checkoutBtn =
    document.getElementById("checkoutBtn");


checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        showToast(
            "Keranjang masih kosong 😭"
        );

        return;

    }


    /*
        Untuk sementara checkout
        membutuhkan login.

        Nanti bagian ini kita sambungkan
        dengan sistem customer login.
    */


    closeCartSidebar();

    openLoginModal();


    showToast(
        "Silakan login untuk checkout 🔐"
    );

});


/* =====================================================
   REGISTER BUTTON
===================================================== */

const registerBtn =
    document.getElementById("registerBtn");


registerBtn.addEventListener("click", () => {

    showToast(
        "Fitur daftar akun segera tersedia."
    );

});


/* =====================================================
   TOAST NOTIFICATION
===================================================== */

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");

    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");


    toast.className = "toast";


    toast.textContent = message;


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.classList.add("show");

    }, 50);


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}


/* =====================================================
   TOAST STYLE
===================================================== */

const toastStyle =
    document.createElement("style");


toastStyle.textContent = `

    .toast {

        position: fixed;

        left: 50%;

        bottom: 30px;

        transform:
            translate(-50%, 20px);

        background: #171717;

        color: white;

        padding: 13px 20px;

        border-radius: 30px;

        font-size: 12px;

        z-index: 9999;

        opacity: 0;

        transition: 0.3s;

        box-shadow:
            0 10px 30px
            rgba(0,0,0,0.2);

    }


    .toast.show {

        opacity: 1;

        transform:
            translate(-50%, 0);

    }

`;


document.head.appendChild(toastStyle);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeCartSidebar();

        closeLoginModal();

        searchBox.classList.remove("active");

    }

});


/* =====================================================
   INITIALIZE
===================================================== */

updateCart();

console.log(
    "LENSORA Camera Store berhasil dijalankan 📷"
);