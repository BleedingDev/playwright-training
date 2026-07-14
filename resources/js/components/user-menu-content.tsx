import { Logout01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { Link, router } from "@inertiajs/react";

import { Icon } from "@/components/icon";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/components/user-info";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { logout } from "@/routes";
import { edit } from "@/routes/user-profile";
import type { User } from "@/types";

interface UserMenuContentProps {
  user: User;
}

export const UserMenuContent = ({ user }: UserMenuContentProps) => {
  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          render={
            <Link
              className="block w-full"
              href={edit()}
              as="button"
              prefetch
              onClick={cleanup}
            />
          }
        >
          <Icon iconNode={Settings01Icon} className="mr-2" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        render={
          <Link
            className="block w-full"
            href={logout()}
            as="button"
            onClick={handleLogout}
            data-test="logout-button"
          />
        }
      >
        <Icon iconNode={Logout01Icon} className="mr-2" />
        Log out
      </DropdownMenuItem>
    </>
  );
};
