import React from "react";
import {
  MenuContent,
  MenuItem,
  MenuItemCommand,
  MenuRoot,
  MenuTrigger,
} from "../ui/menu";
import { Button } from "@chakra-ui/react";
function MenuItemList({ menuList, menuButton, onSelect, isSort }) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          className={`mx-3 p-3 hover:bg-slate-50 hover:text-slate-950`}
          variant="outline"
          size="sm"
        >
          {menuButton}
        </Button>
      </MenuTrigger>
      <MenuContent>
        {menuList?.map((e) => (
          <MenuItem
            value={e}
            onClick={() => {
              console.log("Selected:", e);
              onSelect(e);
            }}
          >
            {e}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}

export default MenuItemList;
