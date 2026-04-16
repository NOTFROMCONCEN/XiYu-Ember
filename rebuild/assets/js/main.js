(function () {
    const btn = document.querySelector('[data-menu-btn]');
    const nav = document.querySelector('[data-nav]');

    if (btn && nav) {
        btn.addEventListener('click', function () {
            nav.classList.toggle('open');
        });

        document.addEventListener('click', function (event) {
            if (!nav.contains(event.target) && event.target !== btn) {
                nav.classList.remove('open');
            }
        });
    }
})();
