import { Count, Text, Visibility } from '../screenplay/questions';
import { tenantCard, tenantCards, tenantStatusBadge, tenantsEmptyNotice } from '../targets/tenants';

export const tenantListed = (name: string) => Visibility.of(tenantCard(name));
export const listedTenant = (name: string) => Text.of(tenantCard(name));
export const listedTenantCount = (name: string) => Count.of(tenantCard(name));
export const tenantCount = Count.of(tenantCards);
export const tenantStatus = (name: string) => Text.of(tenantStatusBadge(name));
export const emptyTenantListShown = Visibility.of(tenantsEmptyNotice);
