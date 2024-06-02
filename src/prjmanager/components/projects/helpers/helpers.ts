export const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
}

export const formateDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
}

export const getInitialsAvatar = (name: string) => {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return `data:image/svg+xml;base64,${btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
            <rect width="36" height="36" fill="#000000" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="18px" font-family="Arial, sans-serif">${initials}</text>
        </svg>`
    )}`;
};