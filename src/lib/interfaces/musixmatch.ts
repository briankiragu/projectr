export type IMusixMatchTrack = {
  track: string;
};

export type IMusixMatchLyrics = {
  lyrics_id: number;
  restricted: number;
  instrumental: number;
  lyrics_body: string;
  lyrics_language: string;
  script_tracking_url: string;
  pixel_tracking_url: string;
  lyrics_copyright: string;
  backlink_url: string;
  updated_time: string;
};

export type IMusixMatchTrackListResponse = {
  message: {
    header: {
      status_code: number;
      execute_time: number;
      available: number;
    };
    body: {
      track_list: IMusixMatchTrack[];
    };
  };
};

export type IMusixMatchLyricsResponse = {
  message: {
    header: {
      status_code: number;
      execute_time: number;
    };
    body: {
      lyrics: IMusixMatchLyrics;
    };
  };
};
