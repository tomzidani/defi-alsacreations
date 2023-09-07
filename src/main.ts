import "./assets/scss/main.scss"
import BitcoinChecker from "./components/bitcoinChecker"

document.addEventListener("DOMContentLoaded", () => {
  const bitcoinCheckerEl = document.querySelectorAll("[data-component='bitcoin-checker']")

  bitcoinCheckerEl.forEach((el) => {
    const bitcoinChecker = new BitcoinChecker(el)
  })
})
