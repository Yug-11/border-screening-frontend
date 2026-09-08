import { Link, matchPath, useLocation } from 'react-router';
import cn from '../../utils/cn';

export default function TopNavigation({
  items = [],
  label = 'Application navigation',
  vertical = false,
  onNavigate,
}) {
  const { pathname } = useLocation();
  return (
    <nav aria-label={label}>
      <ul className={cn(vertical ? 'space-y-1' : 'flex items-center gap-1')}>
        {items.map(({ label: itemLabel, to, icon: Icon, activePaths = [] }) => {
          const isActive = [to, ...activePaths].some((path) =>
            matchPath({ path, end: false }, pathname),
          );
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={isActive ? 'page' : undefined}
                onClick={onNavigate}
                className={cn(
                  'flex min-h-11 items-center gap-2 px-3 py-3 text-body font-medium whitespace-nowrap',
                  vertical ? 'rounded-control border-l-2' : 'border-b-2',
                  isActive
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-transparent text-muted hover:bg-subtle hover:text-navy',
                )}
              >
                {Icon && <Icon aria-hidden="true" className="icon-sm" />}
                {itemLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
