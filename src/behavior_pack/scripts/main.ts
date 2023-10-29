/* eslint-disable @typescript-eslint/no-explicit-any */
import { world, Player, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server'
import { Experience } from '@mcbe-mods/utils'

const LEVEL_30_XP = 1395

// eslint-disable-next-line max-statements
world.afterEvents.itemUse.subscribe((event) => {
  if (event.source.typeId !== 'minecraft:player') return
  const player = event.source as Player

  if (!(player.isSneaking && event.itemStack.typeId === 'xp_book:xp_book')) return

  const equippableInventory = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent

  const playerCurrentXP = player.getTotalXp()

  const xpLore = event.itemStack
    .getLore()
    .filter((item) => item.startsWith('XP'))
    .shift()

  const fetchXP = +(xpLore || '0').replace('XP ', '')
  // fetch
  if (fetchXP) {
    player.addExperience(fetchXP)
    event.itemStack.setLore(['XP 0', 'Level 0'])
    equippableInventory.setEquipment(EquipmentSlot.Mainhand, event.itemStack)
    return
  }

  // storage
  const xp = playerCurrentXP >= LEVEL_30_XP ? LEVEL_30_XP : playerCurrentXP

  player.resetLevel()
  const playerXP = new Experience()
  playerXP.addXP(xp)
  event.itemStack.setLore([`XP ${playerXP.getTotalXP()}`, `Level ${playerXP.getLevel()}`])
  equippableInventory.setEquipment(EquipmentSlot.Mainhand, event.itemStack)

  const _xp = playerCurrentXP - LEVEL_30_XP
  const endXP = _xp > 0 ? _xp : 0
  player.addExperience(endXP)
})
