// Sample address database - in a real app, this could come from an API or database
const sampleAddresses = [
  "123 Main Street, New York, NY",
  "456 Park Avenue, New York, NY",
  "789 Broadway, New York, NY",
  "321 5th Avenue, New York, NY",
  "654 Madison Avenue, New York, NY",
  "987 Lexington Avenue, New York, NY",
  "147 Wall Street, New York, NY",
  "258 Times Square, New York, NY",
  "369 Central Park West, New York, NY",
  "741 Brooklyn Bridge Blvd, New York, NY"
];

export const getSuggestions = (input: string): string[] => {
  if (!input) return [];
  const normalizedInput = input.toLowerCase();
  return sampleAddresses.filter(address => 
    address.toLowerCase().includes(normalizedInput)
  ).slice(0, 5); // Limit to 5 suggestions
};