import { Icons } from './icons';
import { IconItem, CustomIcon } from './types';

const Icon = (props: CustomIcon) => {
  const { name } = props;
  const icon = Icons[name as keyof {}] as IconItem;
  return icon.svg(props);
}

export default Icon;