import { Count, Text, Visibility } from '../screenplay/questions';
import { contractAmount, contractRow, contractRows, contractsEmptyNotice } from '../targets/contracts';

export const contractListed = (tenantName: string) => Visibility.of(contractRow(tenantName));
export const listedContract = (tenantName: string) => Text.of(contractRow(tenantName));
export const listedContractCount = Count.of(contractRows);
export const listedContractsOf = (tenantName: string) => Count.of(contractRow(tenantName));
export const contractListEmpty = Visibility.of(contractsEmptyNotice);
export const listedAmount = (tenantName: string, label: string) => Text.of(contractAmount(tenantName, label));
