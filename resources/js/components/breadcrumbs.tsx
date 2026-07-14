import { Link } from "@inertiajs/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";

export const Breadcrumbs = ({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItemType[];
}) => {
  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <BreadcrumbEntry
            key={getBreadcrumbKey(item)}
            item={item}
            isLast={index === breadcrumbs.length - 1}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const BreadcrumbEntry = ({
  item,
  isLast,
}: {
  item: BreadcrumbItemType;
  isLast: boolean;
}) => (
  <>
    <BreadcrumbItem>
      <BreadcrumbEntryLabel item={item} isLast={isLast} />
    </BreadcrumbItem>
    {isLast ? null : <BreadcrumbSeparator />}
  </>
);

const BreadcrumbEntryLabel = ({
  item,
  isLast,
}: {
  item: BreadcrumbItemType;
  isLast: boolean;
}) =>
  isLast ? (
    <BreadcrumbPage>{item.title}</BreadcrumbPage>
  ) : (
    <BreadcrumbLink render={<Link href={item.href} />}>
      {item.title}
    </BreadcrumbLink>
  );

const getBreadcrumbKey = (item: BreadcrumbItemType) =>
  `${item.title}-${item.href}`;
