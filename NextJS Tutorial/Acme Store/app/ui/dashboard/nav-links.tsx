"use client"; ///Turns this react component into a Client Componet, meaning the Client side (User) affects this area first
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; //A special library that adds rules to when to toggle on certain css classes. So in this case, if it's one conition or the other, show the certain tailwind css.
//But you don't always have to use clsx for styling, it can be used to add condition to classnames.
/*
className={clsx(classes.drawer, {                  // classes.drawer is applied always
          [classes.drawerOpen]: true,              // classes.drawerOpen is applied always, bool = true
          [classes.drawerClose]: !open,            // you can also use boolean variable
          [classes.drawerRed]: colorVar === 'red', // you can also use string variable
        })}
          */

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
