from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


def hitung_diskon(harga_satuan, persentase_diskon, kuantitas):
    """
    Menghitung subtotal, nominal diskon, dan total pembayaran.
    """

    try:
        harga = Decimal(str(harga_satuan).strip())
        diskon = Decimal(str(persentase_diskon).strip().replace(",", "."))
        jumlah = int(str(kuantitas).strip())

    except (InvalidOperation, ValueError, TypeError):
        raise ValueError("Semua input harus berupa angka yang valid.")

    # Validasi angka
    if not harga.is_finite() or harga <= 0:
        raise ValueError("Harga satuan harus lebih dari 0.")

    if not diskon.is_finite() or not (0 <= diskon <= 100):
        raise ValueError("Diskon harus berada di antara 0 sampai 100%.")

    if jumlah <= 0:
        raise ValueError("Kuantitas harus lebih dari 0.")

    # Perhitungan
    subtotal = harga * jumlah

    nominal_diskon = (subtotal * diskon / Decimal("100")).quantize(
        Decimal("1"), rounding=ROUND_HALF_UP
    )

    total_akhir = subtotal - nominal_diskon

    return {
        "harga_satuan": harga,
        "persentase_diskon": diskon,
        "kuantitas": jumlah,
        "subtotal": subtotal,
        "nominal_diskon": nominal_diskon,
        "total_akhir": total_akhir,
    }
