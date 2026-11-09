document.addEventListener("DOMContentLoaded", function () {
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const form = document.querySelector(".calculator-card form");

  const submitButton = form ? form.querySelector(".calculate-button") : null;

  const errorMessage = document.querySelector(".error-message");

  if (form) {
    const inputs = form.querySelectorAll("input");

    inputs.forEach(function (input) {
      function updateInputState() {
        const hasValue = input.value.trim() !== "";

        input.classList.toggle("has-value", hasValue);

        const wrapper = input.closest(".input-wrapper");

        if (wrapper) {
          wrapper.classList.toggle("has-value", hasValue);
        }
      }

      updateInputState();

      input.addEventListener("input", function () {
        updateInputState();

        if (errorMessage) {
          errorMessage.hidden = true;
        }
      });
    });

    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;

        submitButton.classList.add("is-loading");

        submitButton.innerHTML = `
                    <span class="button-spinner"
                          aria-hidden="true"></span>
                    Menghitung...
                `;

        submitButton.setAttribute("aria-busy", "true");
      }
    });
  }

  const resultCard = document.querySelector(".result-card");

  if (resultCard) {
    resultCard.setAttribute("aria-live", "polite");

    resultCard.classList.add("is-visible");
  }

  const totalSection = document.querySelector(".total-section");

  const totalElement = totalSection ? totalSection.querySelector("h3") : null;

  if (totalSection && totalElement) {
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-total-button";
    copyButton.textContent = "⧉ Salin Total Pembayaran";
    copyButton.setAttribute("aria-label", "Salin total pembayaran");
    totalSection.appendChild(copyButton);

    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);

        temporaryInput.select();

        const success = document.execCommand("copy");

        temporaryInput.remove();

        if (!success) {
          throw new Error("Gagal menyalin teks.");
        }
      }
    }

    copyButton.addEventListener("click", async function () {
      const totalPayment = totalElement.textContent.trim();

      try {
        await copyText(totalPayment);

        copyButton.textContent = "✓ Berhasil Disalin!";
        copyButton.classList.add("is-copied");
      } catch (error) {
        console.error("Copy error:", error);

        copyButton.textContent = "Gagal Menyalin";
      }

      setTimeout(function () {
        copyButton.textContent = "⧉ Salin Total Pembayaran";

        copyButton.classList.remove("is-copied");
      }, 2000);
    });
  }
});
