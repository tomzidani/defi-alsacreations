// Styles
import "./assets/scss/main.scss"

// Components
import BitcoinChecker from "./components/BitcoinChecker"

// Once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const bitcoinCheckerEl = document.querySelectorAll("[data-component='bitcoin-checker']")

  bitcoinCheckerEl.forEach((el) => {
    new BitcoinChecker(el)
  })
})
