import LocalStorage from "../services/LocalStorage"
import MessageHandler from "../services/MessageHandler"
import { Currency } from "../lib/types/currency"

class BitcoinChecker {
  el: Element
  selectEl?: HTMLSelectElement
  priceEl?: HTMLSpanElement
  btnEl?: HTMLButtonElement

  constructor(el: Element) {
    this.el = el

    this.init()
  }

  /**
   * Init component.
   */
  init() {
    this.getElements()

    this.updateBitcoinValueResult()
    this.bindEvents()
  }

  /**
   * Get all needed elements.
   */
  getElements() {
    this.btnEl = this.el.querySelector("button[data-action='save-and-update']") || undefined
    this.priceEl = this.el.querySelector("span[data-value='price']") || undefined
    this.selectEl = this.el.querySelector("select#currency[data-action='currency']") || undefined
  }

  /**
   * Get selected currency.
   *
   * @returns {Currency}
   */
  getCurrency(): Currency {
    return this.selectEl?.value as Currency
  }

  /**
   * Get currency symbol.
   *
   * @param {Currency} currency
   * @returns {string}
   */
  getCurrencySymbol(currency: Currency): string {
    const CURRENCY_SYMBOLS = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    }

    return CURRENCY_SYMBOLS[currency] || ""
  }

  /**
   * Get bitcoin current prices by calling an API.
   */
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

  /**
   * Update bitcoin value result by
   * getting prices and updating the DOM.
   */
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

  /**
   * Force to update bitcoin value
   * by calling the API again then updating
   * the DOM.
   */
  async forceUpdateBitcoinValue() {
    this.btnEl!.textContent = "..."

    await this.getBitcoinCurrentPrices()
    await this.updateBitcoinValueResult()

    this.btnEl!.textContent = "Hop!"
  }

  /**
   * Bind events to build interactions.
   */
  bindEvents() {
    this.updateBitcoinValueResult = this.updateBitcoinValueResult.bind(this)
    this.forceUpdateBitcoinValue = this.forceUpdateBitcoinValue.bind(this)

    this.selectEl?.addEventListener("change", this.updateBitcoinValueResult)
    this.btnEl?.addEventListener("click", this.forceUpdateBitcoinValue)
  }
}

export default BitcoinChecker
