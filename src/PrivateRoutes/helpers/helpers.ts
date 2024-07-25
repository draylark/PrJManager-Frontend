export const abbreviateNumber = (number: number) => {
    if (number < 1000) return number.toString();
    const units = ["K", "M", "B", "T"];
    const order = Math.floor(Math.log10(number) / 3);
    const unitname = units[order - 1];
    const num = number / Math.pow(1000, order);
    return num.toFixed(num >= 100 ? 0 : 1) + unitname;
};

export const getInitialsAvatar = (name: string) => {
    const initialsMatch = name.match(/\b\w/g) || []; // Asegurarse de que siempre es un arreglo
    const initials = ((initialsMatch.shift() || '') + (initialsMatch.pop() || '')).toUpperCase();
    return `data:image/svg+xml;base64,${btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
            <rect width="36" height="36" fill="#000000" />
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="18px" font-family="Arial, sans-serif">${initials}</text>
        </svg>`
    )}`;
};

export const getImageOrDefault = (imageUrl: string) => {
    // Verificar si la URL de la imagen es válida (aquí simplemente verifica que no esté vacía)
    if (imageUrl) {
        return imageUrl;
    }
    // Retorna un SVG como imagen por defecto
    // Retorna un SVG como imagen por defecto con un icono de persona
    return `data:image/svg+xml;base64,${btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle cx="50" cy="30" r="20" fill="#ffffff"/>
            <rect x="35" y="50" width="30" height="50" fill="#ffffff"/>
        </svg>`
    )}`;
}

export const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
}

export const formateDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
}

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};