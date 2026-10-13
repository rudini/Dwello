import { Click } from '../screenplay/interactions';
import { cancelButton } from '../targets/form';
import { breadcrumbLink } from '../targets/navigation';

export const cancelEditing = Click.on(cancelButton);
export const chooseBreadcrumb = (label: string) => Click.on(breadcrumbLink(label));
