/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        blacksword: ["Blacksword"],
      },
      keyframes: {
        menuFadeIn: {
          "0%": { opacity: "0", transform: "translateY(0)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        menuFadeOut: {
          "100%": { opacity: "1", transform: "translateY(0)" },
          "0%": { opacity: "0", transform: "translateY(0)" },
        },
      },
      animation: {
        menuFadeIn: "menuFadeIn 0.5s ease-in-out forwards",
      },
      colors: {
        //admin
        navback: "#4f4f4f",
        card1: "#f1f8ff",
        card2: "#fff3e7",
        card3: "#e5f7e7",
        card4: "#feeaea",
        card1sub: "#7391c3",
        card2sub: "#d4aa7f",
        card3sub: "#57a460",
        card4sub: "#ca8383",
        admintext: "#353333",
        bggray: "#e6e6e6",
        error: "#e50004",
        primary: "#267CD2",
        orange: "#f29200",
        mehroon: "#872341",
        //user
        lightblack: "#323232",
        Darkblue: "#0069b3",
        orange: "#f29200",
        lightblue: "#00acb2",

        gray: "#353333",
        seagreen: "#267CD2", // remapped to new primary blue
        seagreenfade: "#267CD2aa",
        textwhite: "#ffffff",
        bggray: "#efefef",
        darkGreen: "#1F66AC", // darker variant of primary
        lightGreen: "#267CD2bb", // semi-transparent lighter variant
        bgGray: "#F0F0F0",
        bgLightGreen: "#F5F9FF", // light background tint for primary
        darkblue: "#223051",
      },
      screens: {
        extremeSmall: "300px",
        verySmall: "638px",
        small: "768px", // Custom screen size for sm
        medium: "1080px", // Custom screen size for md
        large: "1430px", // Custom screen size for lg
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
