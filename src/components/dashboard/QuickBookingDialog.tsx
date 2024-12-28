import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuickBookingForm } from "./QuickBookingForm";

interface QuickBookingDialogProps {
  onClose: () => void;
}

export const QuickBookingDialog = ({ onClose }: QuickBookingDialogProps) => {
  return (
    <DialogContent className="max-w-[95vw] w-full sm:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Quick Booking</DialogTitle>
      </DialogHeader>
      <QuickBookingForm onSuccess={onClose} />
    </DialogContent>
  );
};