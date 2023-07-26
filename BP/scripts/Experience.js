// detail: https://minecraft.fandom.com/wiki/Experience#Leveling_up
export default class Experience {
  #level = 0
  #xp = 0
  #requiredXP = this.#calculateRequiredExp(this.#level)

  #calculateRequiredExp(currentLevel) {
    if (currentLevel < 16) return 2 * currentLevel + 7
    if (currentLevel < 31) return 5 * currentLevel - 38

    return 9 * currentLevel - 158
  }

  getTotalXP() {
    let totalXp = this.#xp
    let level = this.#level
    while (level > 0) {
      level--
      totalXp += this.#calculateRequiredExp(level)
    }
    return totalXp
  }

  addXP(points) {
    this.#xp += points
    while (this.#xp >= this.#requiredXP) {
      this.#level++
      this.#xp -= this.#requiredXP
      this.#requiredXP = this.#calculateRequiredExp(this.#level)
    }
    return this
  }

  getXP() {
    return this.#xp
  }

  setXP(points) {
    this.#xp = 0
    this.addXP(points)
    return this
  }

  addLevel(level) {
    this.#level = Math.max(0, this.#level + level)
    this.#requiredXP = this.#calculateRequiredExp(this.#level)
    return this
  }

  getLevel() {
    return this.#level
  }

  setLevel(level) {
    this.#level = 0
    this.addLevel(level)
    return this
  }
}
