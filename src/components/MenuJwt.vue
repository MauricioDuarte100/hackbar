<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        JWT
      </VBtn>
    </template>
    <VList>
      <VListItem
        title="Decode (Header.Payload)"
        @click="applyFunction('Payload.JWT.decode', true)"
      />
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuJwt',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!

    return {
      mdiMenuDown,
      applyFunction,
    }
  },
})
</script>
