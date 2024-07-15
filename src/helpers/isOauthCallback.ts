import { Location } from "react-router-dom";

export const isOauthCallback = (location: Location) => {
    return location.pathname.startsWith('/callback') && location.search.includes('code=');
}
