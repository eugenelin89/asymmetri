import { botsquadStructure, divisions } from '@/content/site';

type Area = keyof typeof botsquadStructure;

export function BotSquadNavigation({ current, detail }: { current: Area; detail?: string }) {
  const ancestors: Area[] = current === 'investment'
    ? ['overview', 'research', 'investment']
    : current === 'overview' ? ['overview'] : ['overview', current];
  const breadcrumbs = [
    { label: divisions.labs.name, href: divisions.labs.path },
    ...ancestors.map(area => botsquadStructure[area]),
    ...(detail ? [{ label: detail, href: '' }] : []),
  ];

  return (
    <div className="squad-navigation">
      <nav className="squad-breadcrumb" aria-label="Breadcrumb">
        <ol>{breadcrumbs.map((item, index) => (
          <li key={item.label}>
            {index === breadcrumbs.length - 1
              ? <span aria-current="page">{item.label}</span>
              : <a href={item.href}>{item.label}</a>}
          </li>
        ))}</ol>
      </nav>
      <nav className="squad-area-nav" aria-label="BotSquad navigation">
        {Object.entries(botsquadStructure).map(([area, item]) => (
          <a href={item.href} key={area} aria-current={area === current ? (detail ? 'location' : 'page') : undefined}>
            {item.navLabel}
          </a>
        ))}
      </nav>
    </div>
  );
}
