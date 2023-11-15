const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    fontFamily: {
      sans: ['Comfortaa', 'sans-serif']
    },
    extend: {
      colors: {
        spotify: {
          DEFAULT: '#1db954',
          light: '#1ed760'
        }
      },
      borderRadius: {
        '2xl': '50px'
      }
    }
  },
  daisyui: {
    themes: [
      {
        emerald: {
          'primary': '#7bb287',
          'secondary': '#664f63',
          'accent': '#5b9168',
          'neutral': '#222a24',
          'base-100': '#101411'
        },
        nautical: {
          'primary': '#3e6e89',
          'secondary': '#5d2833',
          'accent': '#ac704d',
          'neutral': '#183530',
          'base-100': '#050b0a'
        },
        electric: {
          'primary': '#f9f986',
          'secondary': '#150a66',
          'accent': '#7a788c',
          'neutral': '#222a2a',
          'base-100': '#090b0b'
        },
        pastel: {
          "primary": "#97b0c3",
          "secondary": "#dccdc1",
          "accent": "#4c6b85",
          "neutral": "#dac4b8",
          "base-100": "#eee7e2"
        }
      },
      'dark',
      'light',
    ]
  },
  plugins: [
    require('daisyui')
  ]
};
