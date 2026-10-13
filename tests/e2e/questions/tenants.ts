import { Count, Text, Visibility } from '../screenplay/questions';
import { tenantActiveBadge, tenantCard, tenantCards, tenantsEmptyNotice } from '../targets/tenants';

export const tenantListed = (name: string) => Visibility.of(tenantCard(name));
export const listedTenant = (name: string) => Text.of(tenantCard(name));
export const listedTenantCount = (name: string) => Count.of(tenantCard(name));
export const tenantCount = Count.of(tenantCards);
export const activeBadges = (name: string) => Count.of(tenantActiveBadge(name));
export const emptyTenantListShown = Visibility.of(tenantsEmptyNotice);
