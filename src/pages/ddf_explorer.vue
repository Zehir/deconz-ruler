<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const { t } = useI18n()

// const AppStore = inject('AppStore') as ReturnType<typeof useAppStore>
const AppStore = useAppStore()

const files = $ref<File[]>([])

const data = computed<any[]>(() => {
  console.log(files)
  console.log(files.length)

  if (files.length === 0)
    return []

  function getChunkTag(dat, offs) {
    return String.fromCharCode(dat.getUint8(offs + 0), dat.getUint8(offs + 1), dat.getUint8(offs + 2), dat.getUint8(offs + 3))
  }

  function getChunkSize(dat, offs) {
    return dat.getUint32(offs, true) // little-endian
  }

  function utf8ToString(buf) {
    return new TextDecoder().decode(buf)
  }

  return files.map(async (file) => {
    const buff = await file.arrayBuffer()
    const dat = new DataView(buff)

    let offs = 0
    let size = 0

    if (getChunkTag(dat, offs) !== 'RIFF') {
      console.warn('not a RIFF file')
      return
    }

    offs += 4 // RIFF tag
    offs += 4 // chunk size

    if (getChunkTag(dat, offs) !== 'DDFB') {
      console.warn('not a DDF bundle file')
      return
    }

    offs += 4 // DDFB tag

    // DESC chunk always first
    if (getChunkTag(dat, offs) !== 'DESC') {
      console.warn('not a DESC section not found')
      return
    }

    offs += 4 // DESC tag
    size = getChunkSize(dat, offs)
    offs += 4 // size

    // DESC chunk holds a JSON object describing the bundle
    try {
      const desc = dat.buffer.slice(offs, offs + size)
      const descString = utf8ToString(desc)
      console.log(JSON.parse(descString))
    }
    catch (e) {
      console.warn('failed to parse DESC chunk JSON')
    }
  })
})
</script>

<template>
  <v-container fluid>
    <h1>DDF Explorer</h1>

    <v-form>
      <v-file-input
        v-model="files"
        clearable
        accept=".ddf"
      />
    </v-form>

    {{ data }}
  </v-container>
</template>
