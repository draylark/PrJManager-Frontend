export const cleanUrl = (name: string) => {
    return name.replace(/\./g, '').replace(/\s+/g, '-');
}