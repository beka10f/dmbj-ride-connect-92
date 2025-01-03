import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { QuickBookingDialog } from "./QuickBookingDialog";
import { useState } from "react";

export const QuickBookingButton = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Quick Book
        </Button>
      </DialogTrigger>
      <QuickBookingDialog onClose={() => setOpen(false)} />
    </Dialog>
  );
};