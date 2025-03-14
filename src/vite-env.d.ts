/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCOUNT_ID: number;

  readonly VITE_BROADCAST_NAME: string;

  readonly VITE_MEILI_HOST: string;
  readonly VITE_MEILI_MASTER_KEY: string;

  readonly VITE_MUSIXMATCH_API_URL: string;
  readonly VITE_MUSIXMATCH_API_KEY: string;

  readonly VITE_BIBLE_API_URL: string;
  readonly VITE_BIBLE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
