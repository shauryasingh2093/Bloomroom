/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sage: {
                    50: '#f0f5f0',
                    100: '#e0ebe0',
                    200: '#c1d7c1',
                    300: '#a2c3a2',
                    400: '#83af83',
                    500: '#7db07d',
                    600: '#6a9a6a',
                    700: '#578357',
                    800: '#446d44',
                    900: '#315631',
                },
                blush: {
                    50: '#fff5f7',
                    100: '#ffe8ee',
                    200: '#ffd1dd',
                    300: '#ffbacc',
                    400: '#ffa3bb',
                    500: '#ff8caa',
                    600: '#f5a0b8',
                    700: '#e88ca4',
                    800: '#d47890',
                    900: '#c0647c',
                },
                peach: {
                    50: '#fff8f5',
                    100: '#ffe8e0',
                    200: '#ffd1c1',
                    300: '#ffbaa2',
                    400: '#ffa383',
                    500: '#ff8c64',
                },
                cream: {
                    50: '#fefefe',
                    100: '#faf8f5',
                    200: '#f5f1ec',
                    300: '#f0eae3',
                    400: '#ebe3da',
                    500: '#e6dcd1',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'float': 'float 15s infinite ease-in-out',
                'grain': 'grain 0.5s steps(10) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%': { transform: 'translateY(100vh) translateX(0) scale(0)', opacity: '0' },
                    '10%': { opacity: '0.4' },
                    '90%': { opacity: '0.4' },
                    '100%': { transform: 'translateY(-10vh) translateX(50px) scale(1)', opacity: '0' },
                },
                grain: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '10%': { transform: 'translate(-5%, -10%)' },
                    '20%': { transform: 'translate(-15%, 5%)' },
                    '30%': { transform: 'translate(7%, -25%)' },
                    '40%': { transform: 'translate(-5%, 25%)' },
                    '50%': { transform: 'translate(-15%, 10%)' },
                    '60%': { transform: 'translate(15%, 0%)' },
                    '70%': { transform: 'translate(0%, 15%)' },
                    '80%': { transform: 'translate(3%, 35%)' },
                    '90%': { transform: 'translate(-10%, 10%)' },
                },
            },
        },
    },
    plugins: [],
}
