<template>
  <VMenu>
    <template #activator="{ props }">
      <VBtn :append-icon="mdiMenuDown" variant="text" v-bind="props">
        Shell
      </VBtn>
    </template>
    <VList>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="Python Reverse Shell"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="Python3"
            @click="openReverseShellPrompt('Payload.Shell.Python.py3')"
          />
          <VListItem
            title="Python"
            @click="openReverseShellPrompt('Payload.Shell.Python.py')"
          />
        </VList>
      </VMenu>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="sh(bash) Reverse Shell"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="sh with -i"
            @click="openReverseShellPrompt('Payload.Shell.sh.withI')"
          />
          <VListItem
            title="sh without -i"
            @click="openReverseShellPrompt('Payload.Shell.sh.withoutI')"
          />
        </VList>
      </VMenu>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="nc(ncat) Reverse Shell"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="nc with -e"
            @click="openReverseShellPrompt('Payload.Shell.nc.withE')"
          />
          <VListItem
            title="nc with -c"
            @click="openReverseShellPrompt('Payload.Shell.nc.withC')"
          />
        </VList>
      </VMenu>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="Powershell Reverse Shell"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="DownloadString (IEX)"
            @click="openReverseShellPrompt('Payload.Shell.Powershell.downloadString')"
          />
          <VListItem
            title="TCP Client"
            @click="openReverseShellPrompt('Payload.Shell.Powershell.tcpClient')"
          />
        </VList>
      </VMenu>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="JSP / ASPX Web Shells"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="ASPX Shell (cmd.exe)"
            @click="applyFunction('Payload.Shell.Web.ASPX', true)"
          />
          <VListItem
            title="JSP Shell (Runtime.exec)"
            @click="applyFunction('Payload.Shell.Web.JSP', true)"
          />
        </VList>
      </VMenu>
      <VMenu location="end" open-on-hover>
        <template #activator="{ props }">
          <VListItem
            :append-icon="mdiChevronRight"
            title="PHP Webshell/Reverse Shell"
            v-bind="props"
            @click.stop
          />
        </template>
        <VList>
          <VListItem
            title="Reverse Shell"
            @click="openReverseShellPrompt('Payload.Shell.php.reverseShell')"
          />
          <VListItem
            title="with eval"
            @click="applyFunction('Payload.Shell.php.webshellEval', true)"
          />
          <VListItem
            title="with exec"
            @click="applyFunction('Payload.Shell.php.webshellExec', true)"
          />
          <VListItem
            title="with system"
            @click="applyFunction('Payload.Shell.php.webshellSystem', true)"
          />
          <VListItem
            title="with `"
            @click="applyFunction('Payload.Shell.php.webshellBackquote', true)"
          />
          <VListItem
            title="with any function you want (except eval)"
            @click="
              applyFunction('Payload.Shell.php.webshellAllFunction', true)
            "
          />
          <VListItem
            title="with system && without alphabets and digits (urlencode already)"
            @click="
              applyFunction('Payload.Shell.php.webshellNoAlphabetsDigits', true)
            "
          />
        </VList>
      </VMenu>
    </VList>
  </VMenu>
</template>

<script lang="ts">
import { mdiChevronRight, mdiMenuDown } from '@mdi/js'
import { defineComponent, inject } from 'vue'
import { ApplyFunctionKey, OpenReverseShellPromptKey } from '../utils/constants'

export default defineComponent({
  name: 'MenuShell',
  setup() {
    const applyFunction = inject(ApplyFunctionKey)!
    const openReverseShellPrompt = inject(OpenReverseShellPromptKey)!

    return {
      mdiChevronRight,
      mdiMenuDown,

      applyFunction,
      openReverseShellPrompt,
    }
  },
})
</script>
