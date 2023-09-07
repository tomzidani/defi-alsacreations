import { Currency } from "../lib/types/currency"
import LocalStorage from "../services/LocalStorage"
import MessageHandler from "../services/MessageHandler"

class BitcoinChecker {
  el: HTMLElement
  selectEl?: HTMLSelectElement
  priceEl?: HTMLSpanElement
  btnEl?: HTMLButtonElement

  constructor(el: HTMLElement) {
    this.el = el

    this.init()
  }

  init() {
    this.getElements()

    this.getBitcoinCurrentPrices()
    this.bindEvents()
  }

  getElements() {
    this.btnEl = this.el.querySelector("button[data-action='save-and-update']") || undefined
    this.priceEl = this.el.querySelector("span[data-value='price']") || undefined
    this.selectEl = this.el.querySelector("select#currency[data-action='currency']") || undefined
  }

  getCurrency(): Currency {
    return this.selectEl?.value as Currency
  }

  getCurrencySymbol(currency: Currency): string {
    const CURRENCY_SYMBOLS = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    }

    return CURRENCY_SYMBOLS[currency] || ""
  }

  async getBitcoinCurrentPrices() {
    const req = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")

    if (!req.ok) {
      alert("Erreur !")
    }

    const res = await req.json()
    const currentPrices = res.bpi

    LocalStorage.set("bitcoinPrices", currentPrices)

    return currentPrices
  }

  async updateBitcoinValueResult() {
    const currency = this.getCurrency()
    const hasPrices = LocalStorage.has("bitcoinPrices")

    if (!hasPrices) await this.getBitcoinCurrentPrices()
    if (!currency) return MessageHandler.setMessage("La monnaie sélectionnée est incorrecte")

    const prices = LocalStorage.get("bitcoinPrices")
    const priceInSelectedCurrency: string = prices[currency].rate
    const shortenedPriceInSelectedCurrency = priceInSelectedCurrency.split(".")[0]
    const currencySymbol = this.getCurrencySymbol(currency)

    this.priceEl!.textContent = shortenedPriceInSelectedCurrency + currencySymbol
  }

  updateCurrencyValue() {}

  bindEvents() {
    console.log(this.selectEl)
    this.updateBitcoinValueResult = this.updateBitcoinValueResult.bind(this)

    this.selectEl?.addEventListener("change", this.updateBitcoinValueResult)
  }
}

export default BitcoinChecker
