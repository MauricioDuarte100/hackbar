<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        OR
      </VBtn>
    </template>
    <VList>
       <VListItem title="//google.com" @click="applyFunction('Payload.OpenRedirect.Basic.slashes', true)" />
       <VListItem title="/\google.com" @click="applyFunction('Payload.OpenRedirect.Basic.backslash', true)" />
       <VListItem title="%09/google.com" @click="applyFunction('Payload.OpenRedirect.Basic.urlEncoded', true)" />
       <VListItem title="/%00/google.com" @click="applyFunction('Payload.OpenRedirect.Basic.nullByte', true)" />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuOpenRedirect',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    return { mdiMenuDown, applyFunction }
  },
})
</script>
