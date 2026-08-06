/* =========================================
   LENSWEB - JAVASCRIPT
   ========================================= */

// ================================
// DATA
// ================================

let cart = [];
let isCustomerLoggedIn = false;
let isAdminLoggedIn = false;

let selectedLocation = "";
let selectedPayment = "";
let pendingProduct = null;


// ================================
// HELPER
// ================================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo(0, 0);
}


function openModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {
        modal.classList.add("active");
    }
}


function closeModal(modalId) {

    const modal = document.getElementById(modalId);

    if (modal) {
        modal.classList.remove("active");
    }
}


function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);

}


function showNotification(message) {

    const notification =
        document.getElementById("notification");

    const text =
        document.getElementById("notificationText");

    text.textContent = message;

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);
}


// ================================
// ROLE CUSTOMER
// ================================

document
    .getElementById("customerRoleBtn")
    .addEventListener("click", () => {

        showPage("homePage");

    });


// ================================
// ROLE ADMIN
// ================================

document
    .getElementById("adminRoleBtn")
    .addEventListener("click", () => {

        showPage("adminLoginPage");

    });


// ================================
// BACK ADMIN LOGIN
// ================================

document
    .getElementById("backFromAdminBtn")
    .addEventListener("click", () => {

        showPage("rolePage");

    });


// ================================
// LOGIN ADMIN
// ================================

document
    .getElementById("adminLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("adminUsername").value.trim();

        const password =
            document.getElementById("adminPassword").value.trim();

        const message =
            document.getElementById("adminLoginMessage");


        /*
           LOGIN DEMO UJIKOM

           Username:
           admin

           Password:
           admin123
        */

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            isAdminLoggedIn = true;

            message.textContent = "";

            showNotification("Login admin berhasil!");

            setTimeout(() => {

                showPage("adminPage");

            }, 500);

        } else {

            message.textContent =
                "Username atau password salah.";

            message.style.color = "#c33";

        }

    });


// ================================
// ADMIN LOGOUT
// ================================

document
    .getElementById("adminLogoutBtn")
    .addEventListener("click", () => {

        isAdminLoggedIn = false;

        showNotification("Admin berhasil logout.");

        setTimeout(() => {

            showPage("rolePage");

        }, 500);

    });


// ================================
// CUSTOMER LOGIN
// ================================

document
    .getElementById("customerLoginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("customerEmail").value.trim();

        const password =
            document.getElementById("customerPassword").value.trim();

        const message =
            document.getElementById("customerLoginMessage");


        if (email === "" || password === "") {

            message.textContent =
                "Email dan password wajib diisi.";

            message.style.color = "#c33";

            return;

        }


        // DEMO LOGIN
        isCustomerLoggedIn = true;


        document
            .getElementById("customerName")
            .textContent = "Customer";


        document
            .getElementById("customerEmailDisplay")
            .textContent = email;


        message.textContent =
            "Login berhasil!";

        message.style.color = "#318342";


        setTimeout(() => {

            closeModal("customerLoginModal");

            updateAccountUI();

            showNotification("Login customer berhasil!");

            if (pendingProduct) {

                addToCart(
                    pendingProduct.name,
                    pendingProduct.price
                );

                pendingProduct = null;

                setTimeout(() => {

                    goToCheckout();

                }, 600);

            }

        }, 600);

    });


// ================================
// CUSTOMER ACCOUNT
// ================================

document
    .getElementById("accountBtn")
    .addEventListener("click", () => {

        updateAccountUI();

        openModal("accountModal");

    });


document
    .getElementById("closeAccount")
    .addEventListener("click", () => {

        closeModal("accountModal");

    });


document
    .getElementById("accountLoginBtn")
    .addEventListener("click", () => {

        closeModal("accountModal");

        openModal("customerLoginModal");

    });


function updateAccountUI() {

    const notLogin =
        document.getElementById("accountNotLogin");

    const loggedIn =
        document.getElementById("accountLoggedIn");


    if (isCustomerLoggedIn) {

        notLogin.style.display = "none";

        loggedIn.style.display = "block";

    } else {

        notLogin.style.display = "block";

        loggedIn.style.display = "none";

    }

}


// ================================
// CUSTOMER LOGOUT
// ================================

document
    .getElementById("customerLogoutBtn")
    .addEventListener("click", () => {

        isCustomerLoggedIn = false;

        closeModal("accountModal");

        showNotification("Kamu berhasil logout.");

    });


// ================================
// CLOSE CUSTOMER LOGIN
// ================================

document
    .getElementById("closeCustomerLogin")
    .addEventListener("click", () => {

        closeModal("customerLoginModal");

    });


// ================================
// ADD TO CART
// ================================

function addToCart(name, price) {

    const existingProduct =
        cart.find(item => item.name === name);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }


    updateCart();

    showNotification(
        name + " ditambahkan ke keranjang!"
    );

}


// ================================
// PRODUCT ADD BUTTON
// ================================

document
    .querySelectorAll(".add-cart-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const name =
                button.dataset.product;

            const price =
                Number(button.dataset.price);

            addToCart(name, price);

        });

    });


// ================================
// BUY BUTTON
// ================================

document
    .querySelectorAll(".buy-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const productName =
                button.dataset.product;


            const card =
                button.closest(".product-card");


            const priceText =
                card.querySelector(".price").textContent;


            const price =
                Number(
                    priceText
                        .replace(/[^\d]/g, "")
                );


            if (!isCustomerLoggedIn) {

                pendingProduct = {
                    name: productName,
                    price: price
                };

                openModal("customerLoginModal");

                return;

            }


            addToCart(productName, price);

            goToCheckout();

        });

    });


// ================================
// UPDATE CART
// ================================

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");


    let total = 0;

    let quantityTotal = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Keranjang masih kosong.
            </p>
        `;

    } else {

        cartItems.innerHTML = "";


        cart.forEach((item, index) => {

            const subtotal =
                item.price * item.quantity;

            total += subtotal;

            quantityTotal += item.quantity;


            const itemElement =
                document.createElement("div");

            itemElement.className = "cart-item";


            itemElement.innerHTML = `

                <div class="cart-item-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <small>
                        ${formatRupiah(item.price)}
                        × ${item.quantity}
                    </small>

                </div>

                <strong>
                    ${formatRupiah(subtotal)}
                </strong>

                <button
                    class="remove-cart-btn"
                    data-index="${index}"
                >
                    Hapus
                </button>

            `;


            cartItems.appendChild(itemElement);

        });

    }


    cartCount.textContent = quantityTotal;

    cartTotal.textContent =
        formatRupiah(total);


    document
        .querySelectorAll(".remove-cart-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                cart.splice(index, 1);

                updateCart();

                showNotification(
                    "Produk dihapus dari keranjang."
                );

            });

        });

}


// ================================
// OPEN CART
// ================================

document
    .getElementById("cartBtn")
    .addEventListener("click", () => {

        updateCart();

        openModal("cartModal");

    });


document
    .getElementById("closeCart")
    .addEventListener("click", () => {

        closeModal("cartModal");

    });


// ================================
// CHECKOUT BUTTON
// ================================

document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showNotification(
                "Keranjang masih kosong."
            );

            return;

        }


        if (!isCustomerLoggedIn) {

            closeModal("cartModal");

            openModal("customerLoginModal");

            return;

        }


        closeModal("cartModal");

        goToCheckout();

    });


// ================================
// GO CHECKOUT
// ================================

function goToCheckout() {

    if (cart.length === 0) {

        showNotification(
            "Tambahkan produk terlebih dahulu."
        );

        return;

    }


    showPage("checkoutPage");

    updateCheckout();

}


// ================================
// UPDATE CHECKOUT
// ================================

function updateCheckout() {

    const container =
        document.getElementById("checkoutItems");

    const subtotalElement =
        document.getElementById("checkoutSubtotal");

    const totalElement =
        document.getElementById("checkoutTotal");


    container.innerHTML = "";


    let subtotal = 0;


    cart.forEach(item => {

        const itemSubtotal =
            item.price * item.quantity;

        subtotal += itemSubtotal;


        const element =
            document.createElement("div");

        element.className =
            "checkout-item";


        element.innerHTML = `

            <span>
                ${item.name}
                × ${item.quantity}
            </span>

            <strong>
                ${formatRupiah(itemSubtotal)}
            </strong>

        `;


        container.appendChild(element);

    });


    const shipping = 20000;

    const total =
        subtotal + shipping;


    subtotalElement.textContent =
        formatRupiah(subtotal);


    totalElement.textContent =
        formatRupiah(total);

}


// ================================
// BACK HOME CHECKOUT
// ================================

document
    .getElementById("backHomeFromCheckout")
    .addEventListener("click", () => {

        showPage("homePage");

    });


// ================================
// LOCATION
// ================================

document
    .getElementById("locationBtn")
    .addEventListener("click", () => {

        openModal("locationModal");

    });


document
    .getElementById("closeLocation")
    .addEventListener("click", () => {

        closeModal("locationModal");

    });


document
    .querySelectorAll(".location-choice")
    .forEach(button => {

        button.addEventListener("click", () => {

            selectedLocation =
                button.dataset.location;


            document
                .querySelectorAll(".location-choice")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            document
                .getElementById("selectedLocation")
                .textContent =
                "Lokasi dipilih: " +
                selectedLocation;


            showNotification(
                "Lokasi " +
                selectedLocation +
                " dipilih."
            );

        });

    });


// ================================
// PAYMENT
// ================================

document
    .querySelectorAll(".payment-option")
    .forEach(button => {

        button.addEventListener("click", () => {

            selectedPayment =
                button.dataset.payment;


            document
                .querySelectorAll(".payment-option")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            document
                .getElementById("selectedPayment")
                .textContent =
                "Pembayaran dipilih: " +
                selectedPayment;

        });

    });


// ================================
// BAYAR
// ================================

document
    .getElementById("payBtn")
    .addEventListener("click", () => {

        const name =
            document.getElementById("receiverName").value.trim();

        const phone =
            document.getElementById("receiverPhone").value.trim();

        const address =
            document.getElementById("receiverAddress").value.trim();


        if (name === "" ||
            phone === "" ||
            address === "") {

            showNotification(
                "Lengkapi alamat pengiriman."
            );

            return;

        }


        if (selectedPayment === "") {

            showNotification(
                "Pilih metode pembayaran."
            );

            return;

        }


        if (selectedLocation === "") {

            showNotification(
                "Pilih lokasi pengiriman."
            );

            return;

        }


        // SIMULASI PEMBAYARAN

        showNotification(
            "Pesanan berhasil dibuat! 🎉"
        );


        cart = [];

        updateCart();


        setTimeout(() => {

            showPage("homePage");

        }, 1500);

    });


// ================================
// SEARCH
// ================================

function searchProducts() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const products =
        document.querySelectorAll(".product-card");


    products.forEach(product => {

        const name =
            product.dataset.name.toLowerCase();


        if (name.includes(keyword)) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

}


document
    .getElementById("searchBtn")
    .addEventListener("click", searchProducts);


document
    .getElementById("searchInput")
    .addEventListener("input", searchProducts);


// ================================
// CATEGORY FILTER
// ================================

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;


            document
                .querySelectorAll(".category-btn")
                .forEach(btn => {

                    btn.classList.remove("active");

                });


            button.classList.add("active");


            document
                .querySelectorAll(".product-card")
                .forEach(product => {

                    const productCategory =
                        product.dataset.category;


                    if (
                        category === "all" ||
                        productCategory === category
                    ) {

                        product.style.display = "";

                    } else {

                        product.style.display = "none";

                    }

                });

        });

    });


// ================================
// SHOP NOW
// ================================

document
    .getElementById("shopNowBtn")
    .addEventListener("click", () => {

        document
            .querySelector(".product-section")
            .scrollIntoView({
                behavior: "smooth"
            });

    });


// ================================
// VIEW ALL
// ================================

document
    .getElementById("viewAllBtn")
    .addEventListener("click", () => {

        document
            .querySelectorAll(".product-card")
            .forEach(product => {

                product.style.display = "";

            });


        document
            .querySelectorAll(".category-btn")
            .forEach(btn => {

                btn.classList.remove("active");

            });

    });


// ================================
// ADMIN PRODUCT SEARCH
// ================================

document
    .getElementById("adminProductSearch")
    .addEventListener("input", function() {

        const keyword =
            this.value.toLowerCase().trim();


        const rows =
            document.querySelectorAll(
                "#adminProductTable tr"
            );


        rows.forEach(row => {

            const text =
                row.textContent.toLowerCase();


            if (text.includes(keyword)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });


// ================================
// EDIT PRODUCT
// ================================

document
    .querySelectorAll(".edit-product-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            showNotification(
                "Fitur edit produk siap dikembangkan."
            );

        });

    });


// ================================
// DELETE PRODUCT
// ================================

document
    .querySelectorAll(".delete-product-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const row =
                button.closest("tr");


            if (confirm(
                "Yakin ingin menghapus produk ini?"
            )) {

                row.remove();

                showNotification(
                    "Produk berhasil dihapus."
                );

            }

        });

    });


// ================================
// ADD PRODUCT ADMIN
// ================================

document
    .getElementById("addProductBtn")
    .addEventListener("click", () => {

        const name =
            prompt("Nama produk:");

        if (!name) return;


        const category =
            prompt(
                "Kategori produk:\n" +
                "camera / lens / accessories"
            );

        if (!category) return;


        const price =
            prompt("Harga produk:");

        if (!price) return;


        const stock =
            prompt("Jumlah stok:");

        if (!stock) return;


        const table =
            document.getElementById(
                "adminProductTable"
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${name}</td>

            <td>${category}</td>

            <td>${formatRupiah(
                Number(price)
            )}</td>

            <td>${stock}</td>

            <td>
                <span class="status-active">
                    Aktif
                </span>
            </td>

            <td>

                <button
                    class="edit-product-btn"
                >
                    Edit
                </button>

                <button
                    class="delete-product-btn"
                >
                    Hapus
                </button>

            </td>

        `;


        table.appendChild(row);


        document
            .getElementById("totalProducts")
            .textContent =
            table.querySelectorAll("tr").length;


        showNotification(
            "Produk berhasil ditambahkan."
        );


        // Tombol hapus produk baru
        row
            .querySelector(".delete-product-btn")
            .addEventListener("click", () => {

                if (
                    confirm(
                        "Yakin ingin menghapus produk ini?"
                    )
                ) {

                    row.remove();

                    document
                        .getElementById("totalProducts")
                        .textContent =
                        table.querySelectorAll("tr").length;

                    showNotification(
                        "Produk berhasil dihapus."
                    );

                }

            });


        // Tombol edit produk baru
        row
            .querySelector(".edit-product-btn")
            .addEventListener("click", () => {

                showNotification(
                    "Fitur edit produk siap dikembangkan."
                );

            });

    });


// ================================
// CLOSE MODAL KLIK LUAR
// ================================

document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {

                modal.classList.remove("active");

            }

        });

    });


// ================================
// START
// ================================

showPage("rolePage");

updateCart();

updateAccountUI();

console.log(
    "LENSWEB berhasil dijalankan 🚀"
);