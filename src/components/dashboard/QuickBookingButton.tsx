import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import BookingForm from "../BookingForm";

export const QuickBookingButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-secondary text-primary hover:bg-secondary/90">
          <Plus className="mr-2 h-4 w-4" />
          Quick Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <BookingForm />
      </DialogContent>
    </Dialog>
  );
};