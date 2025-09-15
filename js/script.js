document.addEventListener('DOMContentLoaded', () => {
    const filterToggleButton = document.querySelector('.filter-toggle-btn');
    const filtersSidebar = document.querySelector('.filters-sidebar');

    if (filterToggleButton && filtersSidebar) {
        filterToggleButton.addEventListener('click', () => {
            filtersSidebar.classList.toggle('active');
        });
    }
});
