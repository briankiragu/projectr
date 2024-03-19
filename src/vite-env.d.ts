/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BROADCAST_NAME: string;

  readonly VITE_MEILI_HOST: string;
  readonly VITE_MEILI_PORT: string;
  readonly VITE_MEILI_MASTER_KEY: string;

  readonly VITE_MUSIXMATCH_API_URL: string;
  readonly VITE_MUSIXMATCH_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
