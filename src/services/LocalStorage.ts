class LocalStorage {
  static set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static get(key: string): any {
    return JSON.parse(localStorage.getItem(key) || "")
  }

  static has(key: string): boolean {
    return localStorage.getItem(key) !== null && localStorage.getItem(key) !== undefined
  }
}

export default LocalStorage
