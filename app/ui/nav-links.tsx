'use client';

import {
  UserIcon,
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentCheckIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'Users',
    href: '/dashboard/user',
    icon: UserGroupIcon,
    id: 1,
  },
];

export default function NavLinks({id}: {id: string | number | undefined}) {
  const pathname = usePathname();

  return (
    <>
      <Link
        key="Home"
        href="/dashboard"
        className='flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
      >
        <HomeIcon className="w-6" />
        <p className="hidden md:block">Dashboard</p>
      </Link>
      {links
        .filter((link) => link.id == id)
        .map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
