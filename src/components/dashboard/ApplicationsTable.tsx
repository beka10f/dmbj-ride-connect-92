import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, FileText, Car, Phone } from "lucide-react";
import { format } from "date-fns";

interface DriverApplication {
  id: string;
  user_id: string;
  years_experience: number;
  license_number: string;
  about_text: string | null;
  status: string;
  created_at: string;
}

interface ApplicationsTableProps {
  applications: DriverApplication[];
}

export const ApplicationsTable = ({ applications }: ApplicationsTableProps) => {
  const getStatusStyle = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[300px]">Applicant Info</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">Experience</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">License</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Applied</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow 
                key={application.id}
                className="group border-b border-gray-100 transition-colors dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                          <User className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Driver #{application.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-11">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        +1 (555) 123-4567
                      </span>
                    </div>
                    {application.about_text && (
                      <div className="ml-11 mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {application.about_text}
                        </p>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                      <Car className="h-4 w-4 text-green-500 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {application.years_experience} years
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/20">
                      <FileText className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {application.license_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/20">
                      <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {format(new Date(application.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant="outline" 
                    className={`${getStatusStyle(application.status)} px-3 py-1 rounded-full font-medium text-xs capitalize shadow-sm transition-all group-hover:shadow`}
                  >
                    {application.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};