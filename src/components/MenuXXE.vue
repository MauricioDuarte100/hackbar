<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        XXE
      </VBtn>
    </template>
    <VList>
       <VListItem title="Basic (passwd)" @click="applyFunction('Payload.XXE.Basic.passwd', true)" />
       <VListItem title="Basic (win.ini)" @click="applyFunction('Payload.XXE.Basic.winIni', true)" />
       <VListItem title="SOAP Body" @click="applyFunction('Payload.XXE.SOAP.xxe', true)" />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuXXE',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    return { mdiMenuDown, applyFunction }
  },
})
</script>
