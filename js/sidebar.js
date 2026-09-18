const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');

if (sidebar && sidebarToggle) {
    const closeSidebar = () => {
        sidebar.classList.remove('is-open');
        document.body.classList.remove('sidebar-open');
        sidebarToggle.setAttribute('aria-expanded', 'false');
    };

    sidebarToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('is-open');
        document.body.classList.toggle('sidebar-open', isOpen);
        sidebarToggle.setAttribute('aria-expanded', String(isOpen));
    });

    sidebar.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeSidebar);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });
}