function setViewportHeightUnit() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}

setViewportHeightUnit();
window.addEventListener("resize", setViewportHeightUnit);
window.addEventListener("orientationchange", setViewportHeightUnit);
