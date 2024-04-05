
export const isOauthCallback = (location) => {
    // Puedes ajustar esta lógica según tus necesidades
    return location.pathname.startsWith('/callback') && location.search.includes('code=');
}
