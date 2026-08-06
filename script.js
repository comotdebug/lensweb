let jumlahKeranjang = 0;

function tambahKeranjang(namaProduk) {

    jumlahKeranjang++;

    document.getElementById("cartCount").textContent =
        jumlahKeranjang;

    alert(
        namaProduk +
        " berhasil ditambahkan ke keranjang!"
    );
}


function lihatKeranjang() {

    if (jumlahKeranjang === 0) {

        alert("Keranjang masih kosong.");

    } else {

        alert(
            "Isi keranjang: " +
            jumlahKeranjang +
            " produk."
        );

    }

}