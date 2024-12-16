export default {
    staticMappings: [
       {
          path: '/', 
          mapping: './web'
       }
    ],

    gpxFiles: "../data",
    lyrics: {
      input: "../data/song_lyrics.txt",
      output: "../web/data/lyrics.html"
    }
 };
 