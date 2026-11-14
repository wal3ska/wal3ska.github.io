// just-bash imports Node zlib even in its browser distribution. Core shell
// commands do not use it; make unsupported compression fail explicitly.
export const constants={Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1};
function unavailable(){throw new Error('gzip/gunzip bu tarayıcı çalışma alanında desteklenmiyor.');}
export const gzipSync=unavailable,gunzipSync=unavailable;
