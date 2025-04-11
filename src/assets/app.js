////////////////////////////////////////////////////////////
// DROPDOWN MENU 
////////////////////////////////////////////////////////////
const dropdownBtn = document.querySelector('#dropdown-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Disable transition effect on load (for dropdown menu)
window.addEventListener('load', () => {
    dropdownMenu.classList.remove('no-transition');
});
// Initial state for dropdown menu set to hidden
dropdownMenu.classList.add('dropdown-menu-hidden');

// Function to toggle dropdown menu to be hidden/visible
const dropdownClick = () => {
    dropdownMenu.classList.toggle('dropdown-menu-hidden');
}
// Toggle dropdown menu when button clicked
dropdownBtn.addEventListener("click", dropdownClick);

// Function to reset the toggle button state and hide dropdown menu
const resetToggler = () => {
    // Trigger the reverse animation to revert to hamburger state
    const reverseAnimation = dropdownBtn.querySelector("animate[begin='reverse.begin']");
    reverseAnimation.beginElement();
    // Hide dropdown menu
    dropdownMenu.classList.add('dropdown-menu-hidden');
}

// Media query for screen width
// - 800px is where dropdown button is hidden
const mediaQuery = window.matchMedia("(min-width: 800px)");

// Function that uses mediaQuery's .matches() to check for a resize @ 800px
// If over 800px, reset clicked button and hide dropdown menu.
const handleScreenSizeChange = (e) => {
    e.matches === true && resetToggler();
}

mediaQuery.addEventListener("change", handleScreenSizeChange);