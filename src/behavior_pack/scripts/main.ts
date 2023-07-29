/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityInventoryComponent, Player, world } from '@minecraft/server'
import { Experience } from '@mcbe-mods/utils'

world.afterEvents.itemUse.subscribe((e) => {
  const { source, itemStack } = e

  const player = source as Player

  if (!(player.isSneaking && itemStack.typeId === 'xp_book:xp_book')) return

  const selectedSlot = player.selectedSlot
  const inventory = player.getComponent('inventory') as EntityInventoryComponent
  const currentSlot = inventory.container.getSlot(selectedSlot)

  const XP_RANFE_MAX = 2147483647
  const XP_RANFE_MIN = -(XP_RANFE_MAX + 1) // -2147483648

  const xps = new Experience()
  xps.addXP(player.getTotalXp())

  const xpLore = itemStack
    .getLore()
    .filter((item) => item.startsWith('XP'))
    .shift()

  const xp = +(xpLore || '0').replace('XP ', '')
  // fetch
  if (xp) {
    player.addExperience(xp)
    currentSlot.setLore(['XP 0', 'Level 0'])
    return
  }

  // storage
  currentSlot.setLore([`XP ${xps.getTotalXP()}`, `Level ${xps.getLevel()}`])
  player.addExperience(XP_RANFE_MIN)
  player.addLevels(XP_RANFE_MIN)
})
