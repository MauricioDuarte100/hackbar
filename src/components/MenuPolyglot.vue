<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        Polyglot
      </VBtn>
    </template>
    <VList>
       <VListItem title="0xSobky's Universal (XSS/SQLi)" @click="applyFunction('Payload.Polyglot.Universal.authBypassXSS', true)" />
       <VListItem title="Simple XSS+SQLi" @click="applyFunction('Payload.Polyglot.Universal.simpleXSSSQLi', true)" />
       <VListItem title="Generic Polyglot" @click="applyFunction('Payload.Polyglot.Universal.generic', true)" />
       <VDivider />
       <VListItem title="LFI/RCE (data://)" @click="applyFunction('Payload.Polyglot.LFI_RCE.dataWrapper', true)" />
       <VListItem title="LFI/RCE (php://filter)" @click="applyFunction('Payload.Polyglot.LFI_RCE.phpFilter', true)" />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuPolyglot',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    return { mdiMenuDown, applyFunction }
  },
})
</script>
