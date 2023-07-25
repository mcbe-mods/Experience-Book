// Experience Points

export default class ExperienceSystem {
  constructor() {
    this.level = 0
    this.experience = 0
  }

  calcXP(level) {
    return 7 + (level - 1) * 2
  }

  levelUp() {
    const requiredExperience = this.calcXP(this.level + 1)
    if (this.experience >= requiredExperience) {
      this.level++
      this.experience -= requiredExperience
      this.levelUp()
    }
  }

  addLevel(level) {
    this.level += level
  }

  addXP(points) {
    this.experience += points
    this.levelUp()
  }

  getTotalXP() {
    let totalXP = 0
    for (let level = 1; this.level >= level; level++) {
      totalXP += this.calcXP(level)
    }
    totalXP += this.experience
    return totalXP
  }
}
