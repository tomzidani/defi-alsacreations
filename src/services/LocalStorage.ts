class LocalStorage {
  /**
   * Set a value to localStorage.
   *
   * @param {string} key
   * @param {unknown} value
   */
  static set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * Get a value from localStorage.
   *
   * @param {string} key
   * @returns {any}
   */
  static get(key: string): any {
    return JSON.parse(localStorage.getItem(key) || "")
  }

  /**
   * Check if localStorage contains a value.
   *
   * @param {string} key
   * @returns {boolean}
   */
  static has(key: string): boolean {
    return localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined
  }
}

export default LocalStorage
