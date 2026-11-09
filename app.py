from flask import Flask, render_template, request
from kalkulator_diskon import hitung_diskon
from decimal import Decimal, ROUND_HALF_UP

app = Flask(__name__)


# Format angka menjadi mata uang Rupiah
@app.template_filter("rupiah")
def format_rupiah(nilai):
    angka = int(Decimal(str(nilai)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    return "Rp" + f"{angka:,}".replace(",", ".")


# Halaman utama aplikasi
@app.route("/", methods=["GET", "POST"])
def index():

    hasil = None
    error = None

    form_data = {"harga": "", "diskon": "", "kuantitas": "1"}

    if request.method == "POST":

        form_data = {
            "harga": request.form.get("harga", "").strip(),
            "diskon": request.form.get("diskon", "").strip(),
            "kuantitas": request.form.get("kuantitas", "").strip(),
        }

        try:
            hasil = hitung_diskon(
                form_data["harga"], form_data["diskon"], form_data["kuantitas"]
            )

        except ValueError as e:
            error = str(e)

    return render_template("index.html", hasil=hasil, error=error, form_data=form_data)


if __name__ == "__main__":
    app.run(debug=True)
