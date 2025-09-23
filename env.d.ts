/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEVEL_COLOR_1?: string
  readonly VITE_LEVEL_COLOR_2?: string
  readonly VITE_LEVEL_COLOR_3?: string
  readonly VITE_LEVEL_COLOR_4?: string
  readonly VITE_LEVEL_COLOR_5?: string
  readonly VITE_LEVEL_COLOR_6?: string
  readonly VITE_LEVEL_COLOR_7?: string
  readonly VITE_LEVEL_COLOR_8?: string
  readonly VITE_LEVEL_COLOR_9?: string
  readonly VITE_LEVEL_COLOR_10?: string
  readonly VITE_LEVEL_COLOR_E?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
