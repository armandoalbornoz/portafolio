function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) {
        return;
    }

    let followerTimeout;

    document.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;

        clearTimeout(followerTimeout);
        followerTimeout = setTimeout(() => {
            cursorFollower.style.left = `${clientX}px`;
            cursorFollower.style.top = `${clientY}px`;
        }, 100);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor, { once: true });
} else {
    initCursor();
}
