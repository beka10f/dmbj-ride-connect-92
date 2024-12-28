import { useState } from "react";

interface BookingInstructionsProps {
  instructions: string;
  isEditing: boolean;
  onInstructionsChange: (value: string) => void;
}

export const BookingInstructions = ({
  instructions,
  isEditing,
  onInstructionsChange,
}: BookingInstructionsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Special Instructions</h3>
      {isEditing ? (
        <textarea
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
        />
      ) : (
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          {instructions || "No special instructions"}
        </p>
      )}
    </div>
  );
};