<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        CMDi
      </VBtn>
    </template>
    <VList>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
           <VListItem :append-icon="mdiChevronRight" title="Probes" v-bind="props" @click.stop />
        </template>
        <VList>
           <VListItem title="Unix Basic (; id)" @click="applyFunction('Payload.CMDi.Probes.unixBasic', true)" />
           <VListItem title="Unix Pipe (| id)" @click="applyFunction('Payload.CMDi.Probes.unixPipe', true)" />
           <VListItem title="Unix Backtick (`id`)" @click="applyFunction('Payload.CMDi.Probes.unixBacktick', true)" />
           <VListItem title="Unix Background (& id)" @click="applyFunction('Payload.CMDi.Probes.unixBackground', true)" />
           <VListItem title="Windows Basic (& whoami)" @click="applyFunction('Payload.CMDi.Probes.windowsBasic', true)" />
           <VListItem title="Windows Pipe (| whoami)" @click="applyFunction('Payload.CMDi.Probes.windowsPipe', true)" />
        </VList>
      </VMenu>

      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
           <VListItem :append-icon="mdiChevronRight" title="Blind / Time" v-bind="props" @click.stop />
        </template>
        <VList>
           <VListItem title="Sleep 10s" @click="applyFunction('Payload.CMDi.Blind.sleep', true)" />
           <VListItem title="Ping Loop" @click="applyFunction('Payload.CMDi.Blind.ping', true)" />
        </VList>
      </VMenu>

      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
           <VListItem :append-icon="mdiChevronRight" title="Bypasses" v-bind="props" @click.stop />
        </template>
        <VList>
           <VListItem title="Space ${IFS}" @click="applyFunction('Payload.CMDi.Bypasses.spaceIFS', true)" />
           <VListItem title="Slash ${HOME:0:1}" @click="applyFunction('Payload.CMDi.Bypasses.slash', true)" />
           <VListItem title="Cat Wildcard" @click="applyFunction('Payload.CMDi.Bypasses.cat', true)" />
        </VList>
      </VMenu>
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiChevronRight, mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuCMDi',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    return { mdiChevronRight, mdiMenuDown, applyFunction }
  },
})
</script>
