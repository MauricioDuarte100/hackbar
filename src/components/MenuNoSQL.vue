<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        NoSQL
      </VBtn>
    </template>
    <VList>
       <VListItem title="Auth Bypass (ne: null)" @click="applyFunction('Payload.NoSQL.AuthBypass.neNull', true)" />
       <VListItem title="Auth Bypass (gt: '')" @click="applyFunction('Payload.NoSQL.AuthBypass.gtEmpty', true)" />
       <VListItem title="Auth Bypass (return true)" @click="applyFunction('Payload.NoSQL.AuthBypass.true', true)" />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuNoSQL',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    return { mdiMenuDown, applyFunction }
  },
})
</script>
