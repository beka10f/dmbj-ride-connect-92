interface BookingInstructionsProps {
  isEditing: boolean;
  instructions: string;
  editedInstructions: string;
  onInstructionsChange: (value: string) => void;
}

export const BookingInstructions = ({
  isEditing,
  instructions,
  editedInstructions,
  onInstructionsChange,
}: BookingInstructionsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Special Instructions</h3>
      {isEditing ? (
        <textarea
          value={editedInstructions}
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