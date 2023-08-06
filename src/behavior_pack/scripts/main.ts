/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityInventoryComponent, Player, world } from '@minecraft/server'
import { Experience } from '@mcbe-mods/utils'

const LEVEL_30_XP = 1395

// eslint-disable-next-line max-statements
world.afterEvents.itemUse.subscribe((e) => {
  const { source, itemStack } = e

  const player = source as Player

  if (!(player.isSneaking && itemStack.typeId === 'xp_book:xp_book')) return

  const selectedSlot = player.selectedSlot
  const inventory = player.getComponent('inventory') as EntityInventoryComponent
  const currentSlot = inventory.container.getSlot(selectedSlot)

  const playerCurrentXP = player.getTotalXp()
  const XP_RANFE_MAX = 2147483647
  const XP_RANFE_MIN = -(XP_RANFE_MAX + 1) // -2147483648

  const xpLore = itemStack
    .getLore()
    .filter((item) => item.startsWith('XP'))
    .shift()

  const fetchXP = +(xpLore || '0').replace('XP ', '')
  // fetch
  if (fetchXP) {
    player.addExperience(fetchXP)
    currentSlot.setLore(['XP 0', 'Level 0'])
    return
  }

  // storage
  const xp = playerCurrentXP >= LEVEL_30_XP ? LEVEL_30_XP : playerCurrentXP

  player.addExperience(XP_RANFE_MIN)
  player.addLevels(XP_RANFE_MIN)
  const playerXP = new Experience()
  playerXP.addXP(xp)
  currentSlot.setLore([`XP ${playerXP.getTotalXP()}`, `Level ${playerXP.getLevel()}`])

  const _xp = playerCurrentXP - LEVEL_30_XP
  const endXP = _xp > 0 ? _xp : 0
  player.addExperience(endXP)
})
