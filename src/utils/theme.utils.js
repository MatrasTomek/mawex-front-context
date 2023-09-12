export const setTheme = (darkMode) => {
    if(!darkMode){
        localStorage.setItem('prefersDarkMode', 'true');
    } else {
        localStorage.setItem('prefersDarkMode', 'false');
}
}