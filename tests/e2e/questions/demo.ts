import { Text, Visibility } from '../screenplay/questions';
import { demoNotice, demoNoticeLink } from '../targets/demo';

export const demoNoticeText = Text.of(demoNotice);
export const demoNoticeShown = Visibility.of(demoNotice);
export const demoNoticeLinkText = (name: string) => Text.of(demoNoticeLink(name));
