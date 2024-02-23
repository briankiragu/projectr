/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEILI_HOST: string;
  readonly VITE_MEILI_MASTER_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
