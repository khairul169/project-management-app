import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "./sidebar";
import Appbar from "./appbar";
import { Menu } from "lucide-react";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Appbar.Action icon={<Menu />} className="md:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar className="pt-12" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
