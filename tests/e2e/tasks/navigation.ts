import { Navigate } from '../screenplay/interactions';

export const openPage = (path: string) => Navigate.to(path);
export const reloadPage = Navigate.reload;
