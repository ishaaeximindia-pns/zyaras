
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { transactions } from "@/data/account";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View your recent payments and their status.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                     <Badge
                      variant={transaction.status === "Completed" ? "default" : "secondary"}
                      className={cn({
                          "bg-green-500/10 text-green-700 border-green-500/20": transaction.status === 'Completed',
                          "bg-yellow-500/10 text-yellow-700 border-yellow-500/20": transaction.status === 'Pending',
                      })}
                     >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
