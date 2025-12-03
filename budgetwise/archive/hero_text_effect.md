# Hero Text Effect Archive

This file contains the code for the "Righteous" font and striped shadow animation effect.

## 1. CSS (`globals.css`)

Add the following to your global CSS file.
**IMPORTANT:** The `@import` must be the very first line of the file.

```css
/* 1. Add this at the VERY TOP of the file */
@import url("https://fonts.googleapis.com/css?family=Righteous");

/* 2. Add these styles */
.hero-title {
  display: inline-block;
  color: white;
  font-family: "Righteous", serif;
  /* Adjust color variable as needed */
  text-shadow: 0.03em 0.03em 0 var(--buttoncolor1);
  position: relative;
}

.hero-title:after {
  content: attr(data-shadow);
  position: absolute;
  top: 0.06em;
  left: 0.06em;
  z-index: -1;
  text-shadow: none;
  background-image: linear-gradient(
    45deg,
    transparent 45%,
    hsla(48, 20%, 90%, 1) 45%,
    hsla(48, 20%, 90%, 1) 55%,
    transparent 0
  );
  background-size: 0.05em 0.05em;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shad-anim 15s linear infinite;
}

@keyframes shad-anim {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% -100%;
  }
}
```

## 2. Usage (React/JSX)

Apply the `hero-title` class and the `data-shadow` attribute to your text element.

```jsx
<h1 className="hero-title text-7xl font-bold" data-shadow="BudgetWise">
  BudgetWise
</h1>
```
