const animatedElements = document.querySelectorAll(
    ".why-box, .feature-card"
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

animatedElements.forEach((element) => {
    observer.observe(element);
});